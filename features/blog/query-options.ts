import { listUsersBlogPosts } from "@/features/blog/actions";
import { queryOptions } from "@tanstack/react-query";

export const usersBlogPostOptions = queryOptions({
  queryKey: ["user-posts"],
  queryFn: () => listUsersBlogPosts(),
});
