import { getMenuForDay } from "~/lib/queries/menu-queries";
import { getRecommendations } from "~/lib/queries/recommendation-queries";
import type { GroupedRestaurant, MenuDay } from "~/lib/types";

import { ThemeToggle } from "./theme-toggle";
import { Separator } from "~/components/ui/separator";
import Fuse from "fuse.js";

interface WeekdayPageProps {
  weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
}

export default async function WeekdayPage({ weekday }: WeekdayPageProps) {
  // Calculate the date for the specified weekday of the current week
  const targetDate = getDateForWeekday(weekday);

  // Fetch menu data for the target date
  const meals = await getMenuForDay(targetDate);

  // Get recommendations based on the meals
  const recommendations = await getRecommendations(meals);

  // Filter restaurants that have menus for the selected date
  let restaurantsWithMenus: { name: string; menuDay: MenuDay }[] = [];
  if (meals != undefined) {
    restaurantsWithMenus = meals
      .map((restaurant: GroupedRestaurant) => {
        // Find the menu day that matches the selected date
        const menuDay = restaurant.days.find((day) => {
          return (
            day.date.getFullYear() === targetDate.getFullYear() &&
            day.date.getMonth() === targetDate.getMonth() &&
            day.date.getDate() === targetDate.getDate()
          );
        });

        // If this restaurant doesn't have a menu for the selected date, return null
        if (!menuDay) return null;

        // Return restaurant with meals for the selected date
        return {
          name: restaurant.restaurantName,
          menuDay: { ...menuDay },
        };
      })
      .filter((restaurant) => restaurant !== null) as Array<{
      name: string;
      menuDay: MenuDay;
    }>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky header with app name and controls */}
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text font-semibold text-transparent text-xl">
                Mat
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">
              Restaurant Menus
            </h1>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Browse menus from {restaurantsWithMenus.length} restaurants
            </p>
          </div>
        </div>

        {/* Date selector */}
        <WeekdaySelector
          weekdays={["monday", "tuesday", "wednesday", "thursday", "friday"]}
          selectedWeekday={weekday}
        />

        <div className="h-4" />
        <p className="text-gray-500 text-sm dark:text-gray-400 italic">
          <span className="text-green-500 dark:text-green-400">Green</span>{" "}
          outlines shows meals that are more likely to be of interest.
        </p>
        <div className="h-4" />

        {/* No results message */}
        {restaurantsWithMenus.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center dark:bg-gray-950">
            <h3 className="mb-2 font-medium text-lg">No menus available</h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Try selecting a different day to see available menus.
            </p>
          </div>
        )}

        {/* Restaurant menus */}
        <div className="space-y-8">
          {restaurantsWithMenus.map((restaurant) => {
            // Get all categories for this day
            const categories = getCategoriesFromDay(restaurant.menuDay);

            return (
              <div
                key={restaurant.name}
                className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-950"
              >
                <div className="border-b bg-gray-50 px-4 py-3 dark:bg-gray-900">
                  <h2 className="font-semibold text-lg">{restaurant.name}</h2>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 text-sm dark:text-gray-100">
                            {category}
                          </h3>
                          <Separator className="flex-1" />
                        </div>

                        <div className="space-y-1">
                          {restaurant.menuDay.meals
                            .filter((meal) => meal.category === category)
                            .map((meal, index) => {
                              const recommendationStyling =
                                getRecommendationStyling(
                                  meal.name,
                                  recommendations,
                                );
                              return (
                                <div
                                  key={index}
                                  className={
                                    "rounded-md bg-gray-50 px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800" +
                                    recommendationStyling
                                  }
                                >
                                  <p>{meal.name}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

// Helper component for weekday navigation
function WeekdaySelector({
  weekdays,
  selectedWeekday,
}: {
  weekdays: string[];
  selectedWeekday: string;
}) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2">
        {weekdays.map((day) => {
          const isSelected = selectedWeekday === day;
          return (
            <a
              key={day}
              href={`/${day}`}
              className={`inline-block h-9 shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get the date for a specific weekday of the current week
function getDateForWeekday(weekday: string): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekdayIndex = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ].indexOf(weekday);

  if (weekdayIndex === -1) {
    throw new Error(`Invalid weekday: ${weekday}`);
  }

  const diff = weekdayIndex - dayOfWeek;
  const targetDate = new Date(today);
  targetDate.setHours(0, 0, 0, 0);
  targetDate.setDate(today.getDate() + diff);

  return targetDate;
}

// Helper function to get recommendation styling
function getRecommendationStyling(
  mealName: string,
  recommendations: any,
): string {
  const recommendationSearch = new Fuse(recommendations.recommendations ?? [], {
    keys: ["name"],
    includeScore: true,
  });

  let matches = recommendationSearch.search(mealName);
  if (matches.length > 0) {
    let r = matches[0]!;
    if ((r.score ?? 0.0) < 0.9) {
      if ((r.item as any).tastyness > 7) {
        return " border border-2 border-green-300 dark:border-green-700";
      }
    }
  }
  return "";
}

// Helper function to get unique categories from a day's meals
function getCategoriesFromDay(day: MenuDay): string[] {
  const categories = day.meals.map((meal) => meal.category);
  return [...new Set(categories)];
}
