import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";
import { fetchMealsOfTheWeek } from "~/lib/fetchMeals";
import type {
  GroupedRestaurant,
  Meal,
  MenuDay,
  ResultRecord,
} from "~/lib/types";
import Groq from "groq-sdk";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { meals, posts, restaurants } from "~/server/db/schema";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.mjs";

export const recommendationSchema = z.object({
  name: z.string(),
  tastyness: z.number().min(1).max(10),
  confidenceScore: z.number().min(0).max(1),
});

export type MealRecommendation = z.infer<typeof recommendationSchema>;

export const llmResponseSchema = z.object({
  recommendations: z.array(recommendationSchema),
});

export type MenuRecommendation = z.infer<typeof llmResponseSchema>;

export const menuRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createRestaurant: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(restaurants).values({
        name: input.name,
      });
    }),
  createMeal: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(restaurants).values({
        name: input.name,
      });
    }),
  menuForDay: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      // The server might be on a different timezone, thus we respect the front
      // ends definition of start and end of a day
      const startOfDay = input.date;
      const endOfDay = new Date(input.date);
      endOfDay.setDate(endOfDay.getDate() + 1);

      let result = await ctx.db
        .select({
          restaurantId: restaurants.id,
          restaurantName: restaurants.name,
          meal: meals,
        })
        .from(meals)
        .innerJoin(restaurants, eq(restaurants.id, meals.restaurantId))
        .where(
          and(gte(meals.servedOn, startOfDay), lt(meals.servedOn, endOfDay)),
        );
      if (result.length === 0) {
        fetchMealsOfTheWeek(ctx.db);
        result = await ctx.db
          .select({
            restaurantId: restaurants.id,
            restaurantName: restaurants.name,
            meal: meals,
          })
          .from(meals)
          .innerJoin(restaurants, eq(restaurants.id, meals.restaurantId))
          .where(
            and(gte(meals.servedOn, startOfDay), lt(meals.servedOn, endOfDay)),
          );
      }

      let grouped = groupMealsByRestaurant(result);
      return grouped;
    }),
  recommendations: publicProcedure
    .input(
      z.array(
        z.object({
          restaurantName: z.string().nullable(),
          days: z.array(
            z.object({
              date: z.date(),
              meals: z.array(
                z.object({ category: z.string(), name: z.string() }),
              ),
            }),
          ),
        }),
      ),
    )
    .query(async ({ ctx: _, input }) => {
      if (input.length === 0) {
        return { recommendations: [] };
      }
      let groq = new Groq({ apiKey: env.GROQ_API_KEY });
      const model = "mistral-saba-24b";
      const exampleResponse: MenuRecommendation = {
        recommendations: [
          {
            name: "Högrevsburgare",
            //@ts-ignore
            tastyness: "number (0-10)",
            //@ts-ignore
            confidenceScore: "number (0-1)",
          },
        ],
      };
      let messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are a gastronomic expert recommending meals to a user from a list of available meals and the users preferences or taste. Rate ALL meals the user is MOST LIKELY to enjoy. You output the recommendations in JSON.\n The JSON object MUST adhere to the following example ${JSON.stringify(exampleResponse, null, 4)}`,
        },
        {
          role: "user",
          content: `Jag gillar generellt sett allting som är nattbakat, långkokt och på andra sätt mört. Jag föredrar nöt och fläsk över kyckling. Högrev är fantastiskt. Svensk husmanskost är också bra.\n Veckans tillgängliga rätter är: \n${formatMealsForLLM(input)}`,
        },
      ];
      let chat_completion = (
        await groq.chat.completions.create({
          messages,
          model,
          temperature: 0,
          stream: false,
          response_format: { type: "json_object" },
        })
      ).choices[0]!;
      let response_object = JSON.parse(chat_completion.message.content!);
      return llmResponseSchema.parse(response_object);
    }),
});

function groupMealsByRestaurant(results: ResultRecord[]): GroupedRestaurant[] {
  // A map to hold restaurant grouping information.
  const restaurantMap = new Map<
    number,
    {
      restaurantName: string;
      daysMap: Map<string, MenuDay>;
    }
  >();

  for (const record of results) {
    // Group by restaurantId.
    if (!restaurantMap.has(record.restaurantId)) {
      restaurantMap.set(record.restaurantId, {
        restaurantName: record.restaurantName,
        daysMap: new Map<string, MenuDay>(),
      });
    }
    const restaurantData = restaurantMap.get(record.restaurantId)!;

    // Convert servedOn date to an ISO date string (YYYY-MM-DD) to group meals by day.
    const servedOn = record.meal.servedOn;
    const dateKey = servedOn
      .toLocaleString("en-US", { timeZone: "Europe/Stockholm" })
      .split("T")[0]!; // "YYYY-MM-DD"
    let menuDay = restaurantData.daysMap.get(dateKey);

    if (!menuDay) {
      menuDay = {
        date: new Date(dateKey), // Create a new Date using the key (time set to 00:00:00.000Z)
        meals: [],
      };
      restaurantData.daysMap.set(dateKey, menuDay);
    }

    // Prepare the meal data according to the simple Meal interface.
    const meal: Meal = {
      name: record.meal.name,
      category: record.meal.category,
    };

    menuDay.meals.push(meal);
  }

  // Convert the grouped data into the final GroupedRestaurant[] structure.
  const groupedRestaurants: GroupedRestaurant[] = [];

  for (const { restaurantName, daysMap } of restaurantMap.values()) {
    // Get the days as an array and sort by date if necessary.
    const days: MenuDay[] = Array.from(daysMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    groupedRestaurants.push({
      restaurantName,
      days,
    });
  }

  return groupedRestaurants;
}

function formatMealsForLLM(groups: GroupedRestaurant[]) {
  let output = "";
  for (const group of groups) {
    for (const day of group.days) {
      for (const meal of day.meals) {
        output += `${meal.name}\n`;
      }
    }
  }
  return output;
}
