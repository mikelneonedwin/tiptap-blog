// MOUNT AT /blog

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlogCategoryEnumArray } from "@/generated/enums";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertCircle, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { blogCategoryUrl, getPublicBlogPostUrl } from "../client-utils";
import { infinitePublishedPostOptions } from "../query-options";

export default function BlogPage() {
  const pathname = usePathname();
  const { data, error, isPending, refetch } = useInfiniteQuery(
    infinitePublishedPostOptions,
  );

  const postsToShow = useMemo(() => {
    const posts = data?.pages.flatMap((page) => page.posts) ?? [];
    if (pathname === blogCategoryUrl("All")) return posts;
    const targetCategory = BlogCategoryEnumArray.find((category) => {
      return pathname === blogCategoryUrl(category);
    });
    if (!targetCategory) return [];
    return posts.filter((post) => post.category === targetCategory);
  }, [data?.pages, pathname]);

  if (error)
    return (
      <div className="flex items-center justify-center h-96">
        <Empty className="w-full max-w-md text-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="text-destructive" />
            </EmptyMedia>
            <EmptyTitle className="text-xl">Failed to load blogs</EmptyTitle>
            <EmptyDescription className="text-base/relaxed">
              An error occurred while fetching blog posts. Please try again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="lg" onClick={() => refetch()}>
              Retry
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full border border-border rounded-xl overflow-hidden"
          >
            {/* Image skeleton */}
            <Skeleton className="h-40 w-full rounded-b-none" />

            <div className="p-4 flex flex-col gap-3">
              {/* Top row: date + avatar */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="size-6 rounded-full" />
              </div>

              {/* Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Description lines */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Button area */}
            <div className="p-4 pt-0">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!postsToShow.length)
    return (
      <div className="flex items-center justify-center h-96">
        <Empty className="w-full max-w-md text-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle className="text-xl">No blog posts found</EmptyTitle>
            <EmptyDescription className="text-base/relaxed">
              There are no blog posts available at the moment. Try adding one.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/login">
              <Button size="lg">Add Blog Post</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postsToShow.map((post) => {
        const url = getPublicBlogPostUrl(post.slug);
        return (
          <div
            className="w-full border border-solid border-border rounded-xl"
            key={post.id}
          >
            {/* Top image */}
            <div className="relative h-40 w-full">
              <Image
                src={post.coverImage}
                alt={`Cover image for ${post.title}`}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>

            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">July 14th, 2025</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="size-6 cursor-default">
                      <AvatarImage src={post.author.image ?? "#"} asChild>
                        <Image
                          src={post.author.image ?? "#"}
                          alt={post.author.name}
                          width={24}
                          height={24}
                        />
                      </AvatarImage>
                      <AvatarFallback>
                        {post.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{post.author.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Link href={url} className="text-xl font-semibold leading-tight">
                {post.title}
              </Link>

              <div className="leading-snug">{post.description}</div>
            </div>

            <Link href={url} className="p-2 pt-0 block">
              <Button
                variant="secondary"
                size="lg"
                className="text-lg text-muted-foreground! font-medium w-full"
              >
                Read More
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
