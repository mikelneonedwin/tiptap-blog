// MOUNT AS LAYOUT FOR /blog/**
// MUST HAVE A REVALIDATE EXPORT

import { getQueryClient } from "@/app/get-query-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import BlogNavbar from "../components/layout/blog-navbar";
import { infinitePublishedPostOptions } from "../query-options";

export default async function PublicBlogLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(infinitePublishedPostOptions);
  return (
    <div className="p-8">
      <div className="max-w-360 mx-auto space-y-8">
        <BlogNavbar />
        {children}
        <Link href="/dashboard/blog/new" aria-label="Create new blog post">
          <Button className="fixed bottom-6 right-6 size-14 p-0 rounded-full flex items-center justify-center shadow-lg">
            <Plus className="size-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
