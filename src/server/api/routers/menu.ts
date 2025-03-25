import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";

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

      await ctx.db
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
    }),
});
