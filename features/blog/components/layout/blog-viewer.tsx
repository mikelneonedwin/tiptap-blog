import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateToDayMonthDateOrdinalYear } from "../../client-utils";
import type { BlogPostWithAuthor } from "../../types";

const BlogViewer = ({
  post,
  isPreview,
}: {
  post: BlogPostWithAuthor;
  isPreview?: boolean;
}) => {
  return (
    <div className="relative mx-auto max-w-6xl gap-x-6 px-4 py-10 md:flex md:flex-row md:py-10">
      <article className="mx-auto max-w-3xl pb-20">
        {!isPreview && (
          <Button asChild variant="link">
            <Link href="/blog" className="text-muted-foreground mb-16">
              <ArrowLeft />
              Back to Blog
            </Link>
          </Button>
        )}
        <p className="text-sm leading-5">
          {formatDateToDayMonthDateOrdinalYear(post.updatedAt)}
        </p>
        <h1 className="text-5xl tracking-[-1.07px] font-semibold mt-6 mb-12 leading-[1.2] text-[clamp(28px,5vw,48px)]!">
          {post.title}
        </h1>
        {/* Cover Image */}
        <div className="mb-8 w-full relative">
          <Image
            src={post.coverImage}
            width={1200} // you can adjust
            height={600} // adjust for aspect ratio
            alt={`Cover image for ${post.title}`}
            className="w-full rounded-xl object-cover"
            priority={true} // optionally preload
          />
        </div>
        <span className="text-sm leading-5">Posted by</span>
        <div className="mb-4 mt-2">
          <div className="snap-start rounded-xl shrink-0 items-center gap-2 -m-1 p-4 [transition:background_.2s] inline-flex /hover:bg-accent">
            <Avatar>
              <AvatarImage asChild src={post.author.image ?? "#"}>
                <Image
                  src={post.author.image ?? "#"}
                  alt={post.author.name}
                  loading="lazy"
                  width={32}
                  height={32}
                  decoding="async"
                  className="rounded-full"
                />
              </AvatarImage>
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-stretch justify-start flex-initial">
              <span className="text-sm leading-5 font-medium text-gray-1000">
                {post.author.name}
              </span>
              <span className="text-xs leading-4">Author</span>
            </div>
          </div>
        </div>
        <div
          className="tiptap max-w-none"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      </article>
    </div>
  );
};

export default BlogViewer;
