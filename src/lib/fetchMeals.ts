import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { MenuDb } from "~/server/db";
import { parseKooperativetMenuDays } from "./parseMeals";
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
