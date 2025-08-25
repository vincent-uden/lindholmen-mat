"use client";

import { useState, useTransition } from "react";

interface PostFormProps {
  createPostAction: (name: string) => Promise<void>;
}

export function PostForm({ createPostAction }: PostFormProps) {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      startTransition(async () => {
        try {
          await createPostAction(name);
          setName("");
        } catch (error) {
          console.error("Failed to create post:", error);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        disabled={isPending}
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
        disabled={isPending || !name.trim()}
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
