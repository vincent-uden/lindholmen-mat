import "server-only";
import { cache } from "react";
import { z } from "zod";
import { env } from "~/env";
import type { GroupedRestaurant } from "~/lib/types";
import Groq from "groq-sdk";
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

export const getRecommendations = cache(
  async (groups: GroupedRestaurant[]): Promise<MenuRecommendation> => {
    if (groups.length === 0) {
      return { recommendations: [] };
    }

    let groq = new Groq({ apiKey: env.GROQ_API_KEY });
    const model = "openai/gpt-oss-20b";
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
        content: `Jag gillar generellt sett allting som är nattbakat, långkokt och på andra sätt mört. Jag föredrar nöt och fläsk över kyckling. Högrev är fantastiskt. Svensk husmanskost är också bra.\n Veckans tillgängliga rätter är: \n${formatMealsForLLM(groups)}`,
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
  },
);

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
