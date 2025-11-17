"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { BlogPostWithAuthor } from "../types";
import { Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";

const BlogView = ({ post }: { post: BlogPostWithAuthor }) => {
  const handleShare = useCallback(async () => {
    if (post.status !== "published") return;
    const shareUrl = new URL(`/blog/${post.slug}`, window.location.href).href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `Check out this blog post: ${post.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!", {
          description: "The blog link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Unable to share blog post", error);
      toast.error("Unable to share", {
        description: "Something went wrong while trying to share this post.",
      });
    }
  }, [post.status, post.slug, post.title]);

  const day = String((post.createdAt ?? new Date()).getDate()).padStart(2, "0");
  const month = String((post.createdAt ?? new Date()).getMonth() + 1).padStart(
    2,
    "0",
  );
  const year = String((post.createdAt ?? new Date()).getFullYear()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <>
      <div className="max-w-3xl mx-auto max-md:px-4">
        <div className="flex flex-col items-start gap-[32px]">
          <h1 className="font-medium text-3xl leading-10 sm:text-4xl sm:leading-11 md:text-[40px] md:leading-[50px]">
            {post.title}
          </h1>
          <div className="flex items-center justify-between w-full">
            <Link
              href={post.author.slug ? `/company/${post.author.slug}` : "#"}
              className="flex items-center gap-[8px]"
              ref={(el) => {
                if (!post.author.slug) el?.removeAttribute("href");
              }}
            >
              <Avatar className="size-[28px]">
                <AvatarImage asChild src={post.author.image ?? "#"}>
                  <Image
                    quality={70}
                    src={post.author.image ?? "#"}
                    draggable={false}
                    alt={post.author.name}
                    width={28}
                    height={28}
                  />
                </AvatarImage>
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-[16px] leading-[20px] dark:text-[#B7B7B7]">
                {post.author.name}
              </span>
              <span className="text-[16px] leading-[20px] text-[#6F6F6F]">
                {formattedDate}
              </span>
            </Link>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              title="Share this post"
              className="ml-auto"
              disabled={post.status !== "published"}
            >
              <Share2 className="size-5 opacity-50" />
            </Button>
          </div>
        </div>

        <div className="mt-[32px]">
          {post.coverImage && (
            <Image
              quality={70}
              src={post.coverImage}
              height={384}
              width={768}
              className="rounded-lg mb-8 mx-auto h-96 w-full object-center object-cover"
              alt="Cover Image"
            />
          )}
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BlogView;
