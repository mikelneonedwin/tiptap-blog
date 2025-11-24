// MOUNT AT /blog/post/[postId]

import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getEditBlogPostUrl } from "../client-utils";
import BlogViewer from "../components/layout/blog-viewer";
import { getBlogPostForViewer } from "../loaders";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const cachedFetch = cache(async (slug: string) => {
  const post = await getBlogPostForViewer(slug);
  if (!post) notFound();
  return post;
});

// export const revalidate = 36000;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await cachedFetch(slug);
  const session = await getSession();
  return (
    <>
      <BlogViewer post={post} />;
      {session?.user.id === post.authorId && (
        <Link href={getEditBlogPostUrl(post.id)}>
          <Button
            variant="outline"
            className="fixed bottom-24 right-6 size-14 p-0 rounded-full flex items-center justify-center shadow-lg"
          >
            <Pencil className="size-6" />
          </Button>
        </Link>
      )}
    </>
  );
}
