import {
  getBlogPostForEdits,
  listUsersBlogPosts,
} from "@/features/blog/actions";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { listPublishedPosts } from "./actions";

export const usersBlogPostOptions = queryOptions({
  queryKey: ["user-posts"],
  queryFn: () => listUsersBlogPosts(),
});

export const postToUpdateOptions = (postId: string) =>
  queryOptions({
    queryKey: ["post-edit", postId],
    queryFn: () => getBlogPostForEdits(postId),
  });

export const infinitePublishedPostOptions = infiniteQueryOptions({
  queryKey: ["published-posts"],
  queryFn: ({ pageParam }) => listPublishedPosts(pageParam),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
});
