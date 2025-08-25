import WeekdayPage from "../_components/weekday-page";

export const revalidate = 3600; // 1 hour ISR

export default async function WednesdayPage() {
  return <WeekdayPage weekday="wednesday" />;
}
