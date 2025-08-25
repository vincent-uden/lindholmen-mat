import { Separator } from "~/components/ui/separator";
import { getMenuForDay } from "~/lib/queries/menu-queries";
import {
  getRecommendations,
  type MenuRecommendation,
} from "~/lib/queries/recommendation-queries";
import type { GroupedRestaurant, MenuDay } from "~/lib/types";
import { DateSelector } from "./date-selector";
import { ThemeToggle } from "./theme-toggle";
import Fuse from "fuse.js";

interface LandingServerProps {
  selectedDate: Date;
}

export default async function LandingServer({
  selectedDate,
}: LandingServerProps) {
  // Fetch menu data for the selected date
  const meals = await getMenuForDay(selectedDate);

  // Get recommendations based on the meals
  const recommendations = await getRecommendations(meals);

  // Get all unique dates across all restaurants
  const allDates = getWeekdaysOfCurrentWeek();

  // Filter restaurants that have menus for the selected date
  let restaurantsWithMenus: { name: string; menuDay: MenuDay }[] = [];
  if (meals != undefined) {
    restaurantsWithMenus = meals
      .map((restaurant: GroupedRestaurant) => {
        // Find the menu day that matches the selected date
        const menuDay = restaurant.days.find((day) => {
          return (
            day.date.getFullYear() === selectedDate.getFullYear() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getDate() === selectedDate.getDate()
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

        {/* Date selector pills */}
        <DateSelector
          dates={allDates}
          selectedDate={selectedDate.toISOString()}
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
              Try selecting a different date to see available menus.
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

// Helper function to get recommendation styling
function getRecommendationStyling(
  mealName: string,
  recommendations: MenuRecommendation,
): string {
  const recommendationSearch = new Fuse(recommendations.recommendations ?? [], {
    keys: ["name"],
    includeScore: true,
  });

  let matches = recommendationSearch.search(mealName);
  if (matches.length > 0) {
    let r = matches[0]!;
    if ((r.score ?? 0.0) < 0.9) {
      if (r.item.tastyness > 7) {
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

// Helper function to get weekdays of current week
function getWeekdaysOfCurrentWeek(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Calculate how many days to subtract/add to get Monday.
  // If today is Sunday (0), then we want the following Monday (i.e. diff = 1).
  const diffToMonday = dayOfWeek === 0 ? 1 : 1 - dayOfWeek;

  // Get Monday of the current week.
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + diffToMonday);

  // Create an array of Date objects for Monday to Friday.
  const weekdays: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekdays.push(day);
  }

  return weekdays;
}
