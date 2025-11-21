import {
  getBlogPostForEdits,
  listUsersBlogPosts,
} from "@/features/blog/actions";
import { queryOptions } from "@tanstack/react-query";

export const usersBlogPostOptions = queryOptions({
  queryKey: ["user-posts"],
  queryFn: () => listUsersBlogPosts(),
});

export const postToUpdateOptions = (postId: string) =>
  queryOptions({
    queryKey: ["post-edit", postId],
    queryFn: () => getBlogPostForEdits(postId),
  });