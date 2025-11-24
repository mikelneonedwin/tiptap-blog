import { prisma } from "@/lib/prisma";
import type { BlogPostWithAuthor } from "./types";

export async function getBlogPostForViewer(
  slug: string,
): Promise<BlogPostWithAuthor | null> {
  const result = await prisma.blog.findUnique({
    where: {
      slug,
      status: "published",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  if (!result) return null;
  const tags = (result.tags as string[]) ?? null;
  return {
    ...result,
    tags,
  };
}
