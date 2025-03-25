import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { HydrateClient, api } from "~/trpc/server";
import Landing from "./_components/landing";
import { ThemeProvider } from "./_components/theme-provider";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Landing />
    </HydrateClient>
  );
}
