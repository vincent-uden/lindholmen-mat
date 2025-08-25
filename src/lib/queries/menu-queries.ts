import "server-only";
import { and, eq, gte, lt } from "drizzle-orm";
import { cache } from "react";
import { fetchMealsOfTheWeek } from "~/lib/fetchMeals";
import type {
  GroupedRestaurant,
  Meal,
  MenuDay,
  ResultRecord,
} from "~/lib/types";
import { db } from "~/server/db";
import { meals, restaurants } from "~/server/db/schema";

export const getMenuForDay = cache(
  async (date: Date): Promise<GroupedRestaurant[]> => {
    // The server might be on a different timezone, thus we respect the front
    // ends definition of start and end of a day
    const startOfDay = date;
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    let shops = await db.select().from(restaurants);
    let result = await db
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

    let restaurantIds: any = {};
    for (const r of result) {
      restaurantIds[r.restaurantId] = true;
    }

    if (Object.keys(restaurantIds).length !== shops.length) {
      await fetchMealsOfTheWeek(db);
      result = await db
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
  },
);

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
