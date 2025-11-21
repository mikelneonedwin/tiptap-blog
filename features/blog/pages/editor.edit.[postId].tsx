"use client";

// NOTE MOUNT THIS AT /dashboard/blog/edit/[postId]

import { useParams } from "next/navigation";
import PostToUpateProvider from "../providers/post-to-edit-provider";
import BlogEditorLayout from "./editor";

export default function EditBlogPost() {
  const { postId } = useParams<{
    postId: string;
  }>();
  return (
    <PostToUpateProvider postId={postId}>
      <BlogEditorLayout />
    </PostToUpateProvider>
  );
}
