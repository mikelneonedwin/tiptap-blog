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
    content: blog.content.min(1, "Your post needs some content"),
    id: blogPostIdSchema.optional(),
    title: blog.title.min(1, "Title is required"),
    slug: blog.slug.min(1, "Your post needs a slug"),
    // TODO use an input group for this
    description: blog.description
      .min(1, "Please briefly describe your post")
      .max(
        MAX_DESCRIPTION_LENGTH,
        `Your description should not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      ),
    tags: z
      .object({
        value: z.string(),
      })
      .array()
      .transform((tags) => tags.map((tag) => tag.value))
      .optional(),
    status: blog.status,
    coverImage: z
      .url({
        error: "The blog post needs a cover image",
      })
      .transform(async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], url, {
          type: blob.type,
        });
        return file;
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

export const updateBlogFormSchema = blogFormSchema.in
  .required({
    id: true,
  })
  .extend({
    tags: z.string().array().optional(),
  });
export type UpdateBlogFormInput = z.input<typeof updateBlogFormSchema>;
export type UpdateBlogFormOutput = z.output<typeof updateBlogFormSchema>;
