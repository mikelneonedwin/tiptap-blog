"use server";

// TODO error handling

import { authorizeSession } from "@/features/auth/utils";
import {
  blogFormSchema,
  blogPostIdSchema,
  updateBlogFormSchema,
  type UpdateBlogFormInput,
} from "@/features/blog/schemas";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import { zfd } from "zod-form-data";
import { blobToDataURL, uploadBlogPostCoverImage } from "./server-utils";

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
  const {
    id: _,
    coverImage,
    ...data
  } = zfd.formData(blogFormSchema.out).parse(formData);
  const session = await authorizeSession();
  const authorId = session.user.id;
  const coverImageDataUrl = await blobToDataURL(coverImage);
  const { id, slug } = await prisma.blog.create({
    data: {
      ...data,
      authorId,
      coverImage: coverImageDataUrl,
    },
    select: {
      id: true,
      slug: true,
    },
  });
  const imageUrl = await uploadBlogPostCoverImage(coverImageDataUrl, id);
  await prisma.blog.update({
    where: {
      id,
    },
    data: {
      coverImage: imageUrl,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  return { id, imageUrl };
}

export async function updateBlogPost(formData: FormData) {
  const { id, coverImage, ...update } = zfd
    .formData(
      updateBlogFormSchema.partial().required({
        id: true,
      }),
    )
    .parse(formData);

  const session = await authorizeSession();
  const authorId = session.user.id;

  try {
    const { slug } = await prisma.blog.findUniqueOrThrow({
      where: {
        id,
        authorId,
      },
      select: {
        slug: true,
      },
    });
    revalidatePath(`/blog/${slug}`);
  } catch (error) {
    console.error("User unauthorized from updating post", error);
    unauthorized();
  }

  const finalUpdate: Prisma.BlogUpdateInput = {
    ...update,
  };

  let imageUrl: string | undefined;
  if (coverImage) {
    const dataUrl = await blobToDataURL(coverImage);
    imageUrl = await uploadBlogPostCoverImage(dataUrl, id);
    finalUpdate.coverImage = imageUrl;
  }

  const { slug } = await prisma.blog.update({
    where: {
      id,
      authorId,
    },
    data: finalUpdate,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return {
    ...(imageUrl ? { imageUrl } : null),
  };
}

export async function getBlogPostForEdits(
  postId: string,
): Promise<UpdateBlogFormInput> {
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
    tags: tags ?? [],
  };
}
