import { BlogCategoryEnumArray } from "@/generated/enums";
import { BlogCreateInputObjectZodSchema } from "@/generated/zod/schemas";
import { makeSlug } from "@/lib/utils";
import z from "zod";
import { MAX_DESCRIPTION_LENGTH } from "./constants";

const blog = BlogCreateInputObjectZodSchema.shape;
export const newBlogSchema = z
  .object({
    category: z.enum(BlogCategoryEnumArray, {
      error: "Category is required",
    }),
    content: blog.content.min(1, "Content is required"),
    id: blog.id,
    title: blog.title.min(1, "Title is required"),
    slug: blog.slug,
    description: blog.description.min(1).max(MAX_DESCRIPTION_LENGTH),
    tags: z
      .string()
      .array()
      .optional()
      .or(
        z
          .string()
          .transform((str) => [str])
          .optional(),
      ),
    status: blog.status,
    coverImage: z.url(),
    //   .or(
    //   z
    //     .instanceof(File)
    //     .or(z.instanceof(Blob))
    //     .refine(
    //       (file) => !sfile || file.size <= MAX_FILE_SIZE_MB,
    //       `Image must be less than ${MAX_FILE_SIZE_MB}MB`,
    //     )
    //     .refine(
    //       (file) => !file || file.type.startsWith("image/"),
    //       "Only images are supported",
    //     ),
    // ),
  } satisfies Record<
    Exclude<
      keyof typeof BlogCreateInputObjectZodSchema.shape,
      "author" | "authorId" | "createdAt" | "updatedAt"
    >,
    z.ZodType
  >)
  .transform((blog) => ({
    ...blog,
    slug: blog.slug || makeSlug(blog.title),
  }));

export type BlogForm = z.infer<typeof newBlogSchema>;
