"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
}

export function DateSelector({ dates, selectedDate }: DateSelectorProps) {
  const router = useRouter();

  const handleDateChange = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    router.push(`/${dateString}`);
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2">
        {dates.map((date) => {
          const isSelected =
            selectedDate.getFullYear() === date.getFullYear() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getDate() === date.getDate();

          return (
            <Button
              key={date.toISOString()}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`h-9 shrink-0 ${
                isSelected
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white dark:bg-gray-950"
              }`}
              onClick={() => handleDateChange(date)}
            >
              <span className="font-medium">{format(date, "EEE")}</span>
              <span className="ml-1">{format(date, "MMM d")}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
