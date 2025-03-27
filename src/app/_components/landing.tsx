"use client";

import { format } from "date-fns";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { sampleRestaurants } from "~/lib/sample-data";
import type { GroupedRestaurant, MenuDay } from "~/lib/types";
import { api } from "~/trpc/react";

const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

export default function Landing() {
  // Theme
  const { theme, setTheme } = useTheme();


  // Get all unique dates across all restaurants
  const allDates = getWeekdaysOfCurrentWeek();
  // Date state - only one date at a time
  const [selectedDate, setSelectedDate] = useState(
    initialDate.toISOString() || "",
  );
  const meals = api.menu.menuForDay.useQuery({ date: new Date(selectedDate) });

  let restaurantsWithMenus: { name: string, menuDay: MenuDay }[] = [];
  if (meals.data != undefined) {
    const selected = new Date(selectedDate);
    restaurantsWithMenus = meals.data
      .map((restaurant: GroupedRestaurant) => {
        // Find the menu day that matches the selected date
        const menuDay = restaurant.days.find(
          (day) => {
            console.log(day.date, selected, selectedDate);
            return day.date.getFullYear() === selected.getFullYear() &&
              day.date.getMonth() === selected.getMonth() &&
              day.date.getDate() === selected.getDate();
          }
        );

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
      }>
  }
  useEffect(() => {
    console.log(meals.data);
    console.log(restaurantsWithMenus);
  }, [meals]);

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
              {/* Theme Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {theme === "dark" ? (
                      <Moon className="h-3.5 w-3.5" />
                    ) : (
                      <Sun className="h-3.5 w-3.5" />
                    )}
                    <span className="ml-1">Theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={theme === "light"}
                    onCheckedChange={() => setTheme("light")}
                  >
                    Light
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme("dark")}
                  >
                    Dark
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={theme === "system"}
                    onCheckedChange={() => setTheme("system")}
                  >
                    System
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

        {/* Date selector pills - simplified to only allow one selection */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {allDates.map((date) => (
              <Button
                key={date.toISOString()}
                variant={
                  selectedDate === date.toISOString() ? "default" : "outline"
                }
                size="sm"
                className={`h-9 shrink-0 ${selectedDate === date.toISOString()
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white dark:bg-gray-950"
                  }`}
                onClick={() => setSelectedDate(date.toISOString())}
              >
                <span className="font-medium">{format(date, "EEE")}</span>
                <span className="ml-1">{format(date, "MMM d")}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* No results message */}
        {restaurantsWithMenus.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center dark:bg-gray-950">
            <h3 className="mb-2 font-medium text-lg">No menus available</h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Try selecting a different date to see available menus.
            </p>
          </div>
        )}

        {/* Restaurant menus - simplified to only show one date */}
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
                            .map((meal, index) => (
                              <div
                                key={index}
                                className="rounded-md bg-gray-50 px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                              >
                                {meal.name}
                              </div>
                            ))}
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

// Helper function to get unique categories from a day's meals
function getCategoriesFromDay(
  day: (typeof sampleRestaurants)[0]["days"][0],
): string[] {
  const categories = day.meals.map((meal) => meal.category);
  return [...new Set(categories)];
}

// Helper function to get all unique dates across all restaurants
function getAllDates(restaurants: typeof sampleRestaurants): Date[] {
  const allDatesSet = new Set<string>();

  restaurants.forEach((restaurant) => {
    restaurant.days.forEach((day) => {
      // Use date string for comparison to avoid duplicate dates
      allDatesSet.add(day.date.toISOString().split("T")[0]);
    });
  });

  // Convert back to Date objects and sort chronologically
  return Array.from(allDatesSet)
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());
}
/**
 * Returns Date objects for Monday through Friday of the current week.
 */
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
