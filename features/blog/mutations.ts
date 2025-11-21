"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { deleteBlogPost, publishBlogPost, updateBlogPost } from "./actions";
import { convertBlogOutputToFormData } from "./client-utils";
import { postToUpdateOptions, usersBlogPostOptions } from "./query-options";
import { type BlogFormOutput, type UpdateBlogOutput } from "./schemas";
import { DELETE_BLOG_POST_MUTATION_KEY } from "./constants";

export const useCreateBlogPostMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastId = "CREATE-BLOG-POST";
  return useMutation({
    mutationFn: async (values: BlogFormOutput) => {
      const formData = convertBlogOutputToFormData(values);
      const { id } = await publishBlogPost(formData);
      return { postId: id };
    },
    onMutate: () => {
      toast.loading("Creating blog post", {
        id: toastId,
      });
    },
    onSuccess: ({ postId }, values) => {
      toast.success("Post created successfully", {
        id: toastId,
      });
      const editQueryOption = postToUpdateOptions(postId);
      queryClient.setQueryData(editQueryOption.queryKey, () => ({
        ...values,
        id: postId,
        tags:
          values.tags?.map((value) => ({
            value,
          })) ?? [],
      }));
      queryClient.setQueryData(usersBlogPostOptions.queryKey, (existing) => [
        {
          category: values.category,
          description: values.description,
          id: postId,
          status: values.status,
          title: values.title,
        },
        ...(existing ?? []),
      ]);
      router.replace(`/dashboard/blog/edit/${postId}`);
    },
    onError: (error) => {
      console.error("Error creating blog post", error);
      toast.error("Failed to create blog post", {
        id: toastId,
      });
    },
  });
};

export const useUpdateBlogPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: UpdateBlogOutput) => {
      const formData = convertBlogOutputToFormData(values);
      await updateBlogPost(formData);
    },
    onMutate: ({ id }) => {
      toast.loading("Updating blog post", {
        id: id!,
      });
    },
    onSuccess: (_, values) => {
      const postId = values.id!;
      toast.success("Post updated successfully", {
        id: postId,
      });
      const editQueryOption = postToUpdateOptions(postId);
      queryClient.setQueryData(editQueryOption.queryKey, () => ({
        ...values,
        tags:
          values.tags?.map((value) => ({
            value,
          })) ?? [],
      }));
      queryClient.setQueryData(usersBlogPostOptions.queryKey, (existing) => {
        const allPosts = [...(existing ?? [])];
        const postIndex = allPosts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) allPosts.splice(postIndex, 1);
        allPosts.unshift({
          category: values.category,
          description: values.description,
          id: postId,
          status: values.status,
          title: values.title,
        });
        return allPosts;
      });
    },
    onError: (error, { id }) => {
      console.error("Error updating blog post", error);
      toast.error("Failed to update blog post", {
        id: id!,
      });
    },
  });
};

export const useDeleteBlogPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: DELETE_BLOG_POST_MUTATION_KEY,
    mutationFn: (postId: string) => deleteBlogPost(postId),
    onMutate: (id) => {
      toast.loading("Deleting blog post", {
        id: id!,
      });
    },
    onSuccess: (_, postId) => {
      toast.success("Post deleted successfully", {
        id: postId,
      });
      const editQueryOption = postToUpdateOptions(postId);
      queryClient.removeQueries({
        queryKey: editQueryOption.queryKey,
      });
      queryClient.setQueryData(usersBlogPostOptions.queryKey, (existing) => {
        const allPosts = [...(existing ?? [])];
        return allPosts.filter((post) => post.id === postId);
      });
    },
    onError: (error, id) => {
      console.error("Error deleting blog post", error);
      toast.error("Failed to delete blog post", {
        id: id!,
      });
    },
  });
};
