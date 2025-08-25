import "server-only";
import { cache } from "react";
import { db } from "~/server/db";

export const getLatestPost = cache(async () => {
  const post = await db.query.posts.findFirst({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  return post ?? null;
});

export const sayHello = cache(async (text: string) => {
  return {
    greeting: `Hello ${text}`,
  };
});
