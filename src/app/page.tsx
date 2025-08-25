import { redirect } from "next/navigation";

export default async function Home() {
  // Calculate the current work day and redirect to it
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Map day numbers to weekday names
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  let targetWeekday = weekdays[dayOfWeek];

  // If it's Saturday or Sunday, redirect to Friday
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    targetWeekday = "friday";
  }

  // Redirect to the weekday route
  redirect(`/${targetWeekday}`);
}
