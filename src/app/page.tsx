import { getMenuForWeek } from "~/lib/queries/menu-queries";
import { MenuPage } from "./_components/menu-page";

// ISR - revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const weekData = await getMenuForWeek();

  return <MenuPage weekData={weekData} />;
}
