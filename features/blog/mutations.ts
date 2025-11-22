"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { zfd } from "zod-form-data";
import { deleteBlogPost, publishBlogPost, updateBlogPost } from "./actions";
import { convertBlogOutputToFormData } from "./client-utils";
import { DELETE_BLOG_POST_MUTATION_KEY } from "./constants";
import { usePostToUpdate } from "./providers/post-to-edit-provider";
import { postToUpdateOptions, usersBlogPostOptions } from "./query-options";
import {
  blogFormSchema,
  type BlogFormOutput,
  type UpdateBlogFormOutput,
} from "./schemas";

export const useCreateBlogPostMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastId = "CREATE-BLOG-POST";
  return useMutation({
    mutationFn: async (values: BlogFormOutput) => {
      const formData = convertBlogOutputToFormData(values);
      const newCoverImageFile = new File(
        [values.coverImage],
        `blog-coverImage`,
        {
          type: values.coverImage.type,
        },
      );
      formData.set("coverImage", newCoverImageFile);
      zfd.formData(blogFormSchema.out).parse(formData);
      return await publishBlogPost(formData);
    },
    onMutate: () => {
      toast.loading("Creating blog post", {
        id: toastId,
      });
    },
    onSuccess: ({ id: postId, imageUrl }, values) => {
      toast.success("Post created successfully", {
        id: toastId,
      });
      const editQueryOption = postToUpdateOptions(postId);
      queryClient.setQueryData(editQueryOption.queryKey, () => ({
        ...values,
        coverImage: imageUrl,
        id: postId,
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
  const postToUpdate = usePostToUpdate();
  return useMutation({
    mutationFn: async (values: UpdateBlogFormOutput) => {
      if (!postToUpdate) {
        throw new Error("Unable to detect updatable data");
      }
      const formData = convertBlogOutputToFormData(values);
      for (const _key in postToUpdate) {
        const field = _key as keyof typeof postToUpdate;
        if (field === "tags" || field === "id" || field === "coverImage") {
          continue;
        }
        const original = postToUpdate[field];
        if (!original || original === values[field]) {
          formData.delete(field);
        }
      }

      if (values.coverImage.name === postToUpdate.coverImage) {
        formData.delete("coverImage");
      } else {
        const newCoverImageFile = new File(
          [values.coverImage],
          `blog-${values.id}-coverImage`,
          {
            type: values.coverImage.type,
          },
        );
        formData.set("coverImage", newCoverImageFile);
      }

      if (
        postToUpdate.tags &&
        values.tags &&
        postToUpdate.tags.length === values.tags.length &&
        postToUpdate.tags.every((tag, index) => {
          return tag.value === values.tags?.[index];
        })
      ) {
        formData.delete("tags");
      }
      const result = await updateBlogPost(formData);
      return {
        result,
        postToUpdate,
      };
    },
    onMutate: ({ id }) => {
      toast.loading("Updating blog post", {
        id: id,
      });
    },
    onSuccess: (res, values) => {
      const postId = values.id!;
      toast.success("Post updated successfully", {
        id: postId,
      });
      const editQueryOption = postToUpdateOptions(postId);
      queryClient.setQueryData(editQueryOption.queryKey, () => ({
        ...values,
        coverImage: res.result?.imageUrl ?? res.postToUpdate.coverImage,
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
        id: id,
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
        id: id,
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
        id: id,
      });
    },
  });
};
