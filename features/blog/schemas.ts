import { BlogCategoryEnumArray } from "@/generated/enums";
import { BlogCreateInputObjectZodSchema } from "@/generated/zod/schemas";
import { makeSlug } from "@/lib/utils";
import z from "zod";
import { MAX_DESCRIPTION_LENGTH } from "./constants";

const blogPostIdError = "Invalid blog post id";
export const blogPostIdSchema = z
  .uuid({
    error: blogPostIdError,
  })
  .or(
    z.uuidv4({
      error: blogPostIdError,
    }),
  )
  .or(
    z.uuidv6({
      error: blogPostIdError,
    }),
  )
  .or(
    z.uuidv7({
      error: blogPostIdError,
    }),
  )
  .or(
    z.cuid({
      error: blogPostIdError,
    }),
  )
  .or(
    z.cuid2({
      error: blogPostIdError,
    }),
  );

const blog = BlogCreateInputObjectZodSchema.shape;
export const blogFormSchema = z
  .object({
    category: z.enum(BlogCategoryEnumArray, {
      error: "Category is required",
    }),
    content: blog.content.min(1, "Content is required"),
    id: blogPostIdSchema.optional(),
    title: blog.title.min(1, "Title is required"),
    slug: blog.slug,
    description: blog.description.min(1).max(MAX_DESCRIPTION_LENGTH),
    tags: z
      .object({
        value: z.string(),
      })
      .array()
      .transform((tags) => tags.map((tag) => tag.value))
      .optional(),
    status: blog.status,
    coverImage: z.url({
      error: "The blog post needs a cover image",
    }),
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

export type BlogFormOutput = z.output<typeof blogFormSchema>;
export type BlogFormInput = z.input<typeof blogFormSchema>;

export const updateBlogSchema = blogFormSchema.in.extend({
  id: blogFormSchema.in.shape.id.unwrap(), // require post id
});
export type UpdateBlogInput = z.input<typeof updateBlogSchema>;
export type UpdateBlogOutput = z.output<typeof updateBlogSchema>;
