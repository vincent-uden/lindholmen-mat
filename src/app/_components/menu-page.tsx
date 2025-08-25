"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { GroupedRestaurant } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface MenuPageProps {
  weekData: GroupedRestaurant[];
}

export function MenuPage({ weekData }: MenuPageProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 6 || dayOfWeek === 0) {
      const friday = new Date(today);
      friday.setDate(today.getDate() - (dayOfWeek === 6 ? 1 : 2));
      return friday;
    }

    return today;
  });

  const availableDates = Array.from(
    new Set(
      weekData.flatMap((restaurant) =>
        restaurant.days.map((day) => day.date.toDateString()),
      ),
    ),
  )
    .map((dateString) => new Date(dateString))
    .sort((a, b) => a.getTime() - b.getTime());

  const dayData = weekData
    .map((restaurant) => ({
      ...restaurant,
      days: restaurant.days.filter((day) => {
        return (
          day.date.getFullYear() === selectedDate.getFullYear() &&
          day.date.getMonth() === selectedDate.getMonth() &&
          day.date.getDate() === selectedDate.getDate()
        );
      }),
    }))
    .filter((restaurant) => restaurant.days.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Mat på Lindholmen
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Vad ska vi äta {format(selectedDate, "EEEE")}?
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {availableDates.map((date) => {
                const isSelected =
                  selectedDate.getFullYear() === date.getFullYear() &&
                  selectedDate.getMonth() === date.getMonth() &&
                  selectedDate.getDate() === date.getDate();

                return (
                  <Button
                    key={date.toISOString()}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`h-9 shrink-0 ${isSelected
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-white dark:bg-gray-950"
                      }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <span className="font-medium">{format(date, "EEE")}</span>
                    <span className="ml-1">{format(date, "MMM d")}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {dayData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Ingen meny tillgänglig för {format(selectedDate, "EEEE d MMMM")}
              </p>
            </div>
          ) : (
            dayData.map((restaurant) => (
              <div
                key={restaurant.restaurantName}
                className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {restaurant.restaurantName}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {restaurant.days[0]?.meals.map((meal, index) => (
                    <div
                      key={index}
                      className="rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-700 max-w-xs min-w-[300px] flex-1 flex flex-col justify-stretch border border-1 border-gray-100 dark:border-gray-800"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white leading-tight">
                        {meal.name}
                      </h3>
                      <div className="flex-grow" />
                      {meal.category && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {meal.category}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
