import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { MenuDb } from "~/server/db";
import { parseKooperativetMenuDays, parseWorldOfFoodRSS } from "./parseMeals";
import type { MenuDay } from "./types";
import { meals, restaurants } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function fetchMealsOfTheWeek(db: MenuDb) {
  let kooperativetMenus = await fetchKooperativetMeals();
  let kooperativet = (
    await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.name, "Kooperativet"))
      .limit(1)
  )[0]!;
  let newMeals = [];
  for (const menu of kooperativetMenus) {
    for (const meal of menu.meals) {
      newMeals.push({
        name: meal.name,
        category: meal.category,
        restaurantId: kooperativet.id,
        servedOn: menu.date,
      });
    }
  }
  let worldOfFoodMenus = await fetchWorldOfFoodRSS();
  let worldOfFood = (
    await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.name, "World of Food"))
      .limit(1)
  )[0]!;
  for (const menu of worldOfFoodMenus) {
    for (const meal of menu.meals) {
      newMeals.push({
        name: meal.name,
        category: meal.category,
        restaurantId: worldOfFood.id,
        servedOn: menu.date,
      });
    }
  }

  await db.insert(meals).values(newMeals);
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
