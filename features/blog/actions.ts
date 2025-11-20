"use server";

// TODO error handling

import { authorizeSession } from "@/features/auth/actions";
import { prisma } from "@/lib/prisma";
import { newBlogSchema } from "@/features/blog/schemas";
import { revalidatePath } from "next/cache";
import z from "zod";
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

export async function deleteBlogPost({ id }: { id: string }) {
  z.string({
    error: "Invalid blog post id",
  }).parse(id);
  const session = await authorizeSession();
  await prisma.blog.delete({
    where: {
      id: id,
      authorId: session.user.id,
    },
    select: {},
  });
}

export async function publishBlog(formData: FormData) {
  const { id: _, ...data } = zfd.formData(newBlogSchema).parse(formData);
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

const updateBlogSchema = zfd.formData(
  newBlogSchema.in.extend({
    id: newBlogSchema.in.shape.id.unwrap(), // require post id
  }),
);

export async function updateBlog(formData: FormData) {
  const { id, ...update } = updateBlogSchema.parse(formData);

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
