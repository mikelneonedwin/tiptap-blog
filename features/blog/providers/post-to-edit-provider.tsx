"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";
import { postToUpdateOptions } from "../query-options";
import type { UpdateBlogInput } from "../schemas";

const PostToUpdateContext = createContext<UpdateBlogInput | null>(null);

export const usePostToUpdate = () => useContext(PostToUpdateContext);
export const useIsUpdatingPost = () => {
  const postToUpdate = usePostToUpdate();
  return postToUpdate
    ? {
        postId: postToUpdate.id,
      }
    : null;
};

const PostToUpateProvider = ({
  postId,
  children,
}: {
  postId: string;
  children: ReactNode;
}) => {
  const { data, isPending, error, refetch } = useQuery(
    postToUpdateOptions(postId),
  );
  if (isPending)
    return (
      <div className="flex items-center h-svh justify-center">
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Fetching post…</EmptyTitle>
            <EmptyDescription>
              Hold on while we load your blog post.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );

  if (error) {
    console.error(`Error loading blog post ${postId} for edits`, error);
    return (
      <div className="flex items-center h-svh justify-center">
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangle className="size-7" />
            </EmptyMedia>
            <EmptyTitle>Failed to load post</EmptyTitle>
            <EmptyDescription>
              Something went wrong while fetching your blog post.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => refetch()}>Retry</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <PostToUpdateContext.Provider value={data}>
      {children}
    </PostToUpdateContext.Provider>
  );
};

export default PostToUpateProvider;
