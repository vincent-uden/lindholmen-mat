import WeekdayPage from "../_components/weekday-page";

export const revalidate = 3600; // 1 hour ISR

export default async function FridayPage() {
  return <WeekdayPage weekday="friday" />;
}
