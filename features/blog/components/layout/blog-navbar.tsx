"use client";

import { Skeleton } from "@/components/ui/skeleton"; // shadcn Skeleton
import type { BlogCategory } from "@/generated/prisma";
import { useInfiniteQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { blogCategoryUrl } from "../../client-utils";
import { infinitePublishedPostOptions } from "../../query-options";

const BlogNavbar = () => {
  const { data, error, isPending } = useInfiniteQuery(
    infinitePublishedPostOptions,
  );

  const pathname = usePathname();

  const categoriesToShow = useMemo((): ("All" | BlogCategory)[] => {
    const posts = data?.pages.flatMap((page) => page.posts) ?? [];
    const categoryList = posts.map((post) => post.category);
    const uniqueCategories = new Set(categoryList);
    if (uniqueCategories.size < 2) return ["All"];
    return ["All", ...Array.from(uniqueCategories)];
  }, [data?.pages]);

  if (error) return null;

  const showHeader = !pathname.startsWith("/blog/post");

  // Loading state with skeleton
  if (isPending) {
    return (
      <nav className="space-y-6">
        {showHeader && (
          <div>
            <Skeleton className="h-15 w-64 rounded-md" />
          </div>
        )}
        <div className="flex items-center gap-6">
          {Array(5)
            .fill(null)
            .map((_, idx) => (
              <Skeleton key={idx} className="h-5 w-24 rounded-sm" />
            ))}
        </div>
      </nav>
    );
  }

  const activeCategory = categoriesToShow.find((category) => {
    return pathname === blogCategoryUrl(category);
  });

  if (!showHeader && categoriesToShow.length <= 1) return null;

  return (
    <nav className="space-y-5">
      {activeCategory && showHeader && (
        <div>
          <h2 className="text-6xl tracking-[-.03em] font-medium">
            {activeCategory}
          </h2>
        </div>
      )}
      {categoriesToShow.length > 1 && (
        <div className="flex items-center gap-6 z-10 top-0 bg-background/50 backdrop-blur">
          {categoriesToShow.map((category) => {
            const url = blogCategoryUrl(category);
            const isActive = pathname === url;
            return (
              <Link
                href={url}
                key={category}
                className={clsx(
                  "text-xl font-medium rounded-sm transition-colors duration-200 hover:text-primary",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {category}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default BlogNavbar;
