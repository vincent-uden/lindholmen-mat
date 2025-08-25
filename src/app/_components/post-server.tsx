import { createPost } from "~/lib/actions/post-actions";
import { getLatestPost } from "~/lib/queries/post-queries";
import { PostForm } from "./post-form";

export async function LatestPostServer() {
  const latestPost = await getLatestPost();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <PostForm createPostAction={createPost} />
    </div>
  );
}
