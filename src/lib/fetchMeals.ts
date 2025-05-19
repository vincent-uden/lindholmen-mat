import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { MenuDb } from "~/server/db";
import {
  parseBombayBistroMenuDays,
  parseDistrictOneMenuDays,
  parseKooperativetMenuDays,
  parseWorldOfFoodRSS,
} from "./parseMeals";
import type { MenuDay } from "./types";
import { meals, restaurants } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function fetchMealsOfTheWeek(db: MenuDb) {
  let names = [
    "Kooperativet",
    "World of Food",
    "Bombay Bistro",
    "District One",
  ];
  let results = await Promise.allSettled([
    fetchKooperativetMeals(),
    fetchWorldOfFoodRSS(),
    fetchBombayBistroMeals(),
    fetchDistrictOneMeals(),
  ]);
  let newMeals = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i]!.status === "fulfilled") {
      //@ts-expect-error
      let menus: MenuDay[] = results[i]!.value;
      let restaurant = (
        await db
          .select()
          .from(restaurants)
          .where(eq(restaurants.name, names[i]!))
          .limit(1)
      )[0]!;
      for (const menu of menus) {
        for (const meal of menu.meals) {
          newMeals.push({
            name: meal.name,
            category: meal.category,
            restaurantId: restaurant.id,
            servedOn: menu.date,
          });
        }
      }
    }
  }
  await db
    .insert(meals)
    .values(newMeals)
    .onConflictDoUpdate({
      target: [meals.name, meals.category, meals.servedOn, meals.restaurantId],
      set: { name: meals.name },
    });
}

export async function fetchKooperativetMeals(): Promise<MenuDay[]> {
  // Replace the URL with the correct page URL.
  const url = "https://www.kooperativet.se/";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch page: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const menuDays = parseKooperativetMenuDays(html, new Date());
  return menuDays;
}

/**
 * Fetches the WorldOfFood RSS feed as an XML string.
 *
 * @returns The RSS XML content as a string.
 * @throws An error if the fetch fails.
 */
export async function fetchWorldOfFoodRSS(): Promise<MenuDay[]> {
  const url =
    "https://www.compass-group.se/menuapi/feed/rss/current-week?costNumber=448305&language=sv";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch RSS feed: ${response.status} ${response.statusText}`,
    );
  }

  const rss = await response.text();
  return parseWorldOfFoodRSS(rss);
}

export async function fetchBombayBistroMeals(): Promise<MenuDay[]> {
  const url = "https://lindholmen.restaurangbombay.se/lunch/";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch page: ${response.status} ${response.statusText}`,
    );
  }
  const html = await response.text();
  const menuDays = parseBombayBistroMenuDays(html, new Date());
  return menuDays;
}

export async function fetchDistrictOneMeals(): Promise<MenuDay[]> {
  const url = "https://districtone.se/lunch.html";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch page: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const menuDays = parseDistrictOneMenuDays(html, new Date());
  return menuDays;
}
