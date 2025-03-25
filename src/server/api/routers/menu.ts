import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { fetchMealsOfTheWeek } from "~/lib/fetchMeals";
import type {
  GroupedRestaurant,
  Meal,
  MenuDay,
  ResultRecord,
} from "~/lib/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { meals, posts, restaurants } from "~/server/db/schema";

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
      const startOfDay = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        input.date.getDate(),
      );

      const endOfDay = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        input.date.getDate(),
      );
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
      console.log(result);
      console.log(startOfDay, endOfDay);
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
    const dateKey = servedOn.toISOString().split("T")[0]!; // "YYYY-MM-DD"
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
