"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export async function createPost(name: string) {
  if (name.length < 1) {
    throw new Error("Name must be at least 1 character long");
  }

  await db.insert(posts).values({
    name,
  });

  // Revalidate the page to show the new post
  revalidatePath("/");
}
