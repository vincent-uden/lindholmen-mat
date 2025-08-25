"use client";

import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

interface DateSelectorProps {
  dates: Date[];
  selectedDate: string;
}

export function DateSelector({ dates, selectedDate }: DateSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("date", date.toISOString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2">
        {dates.map((date) => (
          <Button
            key={date.toISOString()}
            variant={
              selectedDate === date.toISOString() ? "default" : "outline"
            }
            size="sm"
            className={`h-9 shrink-0 ${
              selectedDate === date.toISOString()
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-white dark:bg-gray-950"
            }`}
            onClick={() => handleDateChange(date)}
          >
            <span className="font-medium">{format(date, "EEE")}</span>
            <span className="ml-1">{format(date, "MMM d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
