import LandingServer from "./_components/landing-server";

export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Get the selected date from search params or default to today (adjusted for weekends)
  let selectedDate: Date;
  if (params.date) {
    selectedDate = new Date(params.date);
  } else {
    const initialDate = new Date();
    initialDate.setHours(0, 0, 0, 0);

    // Check if today is Saturday (6) or Sunday (0)
    const dayOfWeek = initialDate.getDay();

    // If it's Saturday, subtract one day; if it's Sunday, subtract two days.
    if (dayOfWeek === 6) {
      initialDate.setDate(initialDate.getDate() - 1);
    } else if (dayOfWeek === 0) {
      initialDate.setDate(initialDate.getDate() - 2);
    }

    selectedDate = initialDate;
  }

  return <LandingServer selectedDate={selectedDate} />;
}
