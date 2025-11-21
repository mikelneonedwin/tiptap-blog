"use server";

// TODO error handling

import { authorizeSession } from "@/features/auth/actions";
import {
  blogFormSchema,
  blogPostIdSchema,
  updateBlogSchema,
  type BlogFormInput,
} from "@/features/blog/schemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";

export async function listUsersBlogPosts() {
  const session = await authorizeSession();
  const results = await prisma.blog.findMany({
    where: {
      authorId: session.user.id,
    },
    select: {
      title: true,
      id: true,
      status: true,
      category: true,
      description: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return results;
}

export async function deleteBlogPost(id: string) {
  blogPostIdSchema.parse(id);
  const session = await authorizeSession();
  await prisma.blog.delete({
    where: {
      id: id,
      authorId: session.user.id,
    },
    select: {},
  });
}

export async function publishBlogPost(formData: FormData) {
  const { id: _, ...data } = zfd.formData(blogFormSchema).parse(formData);
  const session = await authorizeSession();
  const authorId = session.user.id;
  // const coverImage = await uploadImage(data.coverImage, {
  //   folder: "blog",
  // });

  const { id, slug } = await prisma.blog.create({
    data: {
      ...data,
      authorId,
      // coverImage: coverImage?.url,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  return { id };
}

export async function updateBlogPost(formData: FormData) {
  const { id, ...update } = zfd.formData(updateBlogSchema).parse(formData);

  const session = await authorizeSession();
  const authorId = session.user.id;
  // const coverImage = await uploadImage(update.coverImage, {
  //   folder: "blog",
  //   public_id: id,
  //   overwrite: true,
  // });

  const { slug } = await prisma.blog.update({
    where: {
      id,
      authorId,
    },
    data: {
      ...update,
      authorId,
      // coverImage: coverImage?.url,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function getBlogPostForEdits(postId: string) {
  blogPostIdSchema.parse(postId);
  const post = await prisma.blog.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      category: true,
      content: true,
      coverImage: true,
      description: true,
      id: true,
      slug: true,
      status: true,
      tags: true,
      title: true,
    },
  });
  const tags = post.tags as string[] | null;
  return {
    ...post,
    tags:
      tags?.map((value) => ({
        value,
      })) ?? [],
  } satisfies BlogFormInput;
}
