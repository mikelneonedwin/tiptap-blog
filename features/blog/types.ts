import type { Blog, User } from "@/generated/prisma";
import { listUsersBlogPosts } from "./actions";

export interface AppBlogPost extends Omit<Blog, "tags"> {
  tags: string[] | null;
}

export interface BlogPostWithAuthor extends AppBlogPost {
  author: Pick<User, "name" | "image">;
}

export type ListedPost = Awaited<ReturnType<typeof listUsersBlogPosts>>[number];

export type CroppedImageArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};
