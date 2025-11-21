import { zfd } from "zod-form-data";
import { blogFormSchema, type BlogFormOutput } from "./schemas";

export function convertBlogOutputToFormData({
  tags,
  ...values
}: BlogFormOutput) {
  const formData = new FormData();
  for (const key in values) {
    const value = values[key as keyof typeof values];
    if (!value) continue;
    formData.append(key, value);
  }
  tags?.forEach((tag) => formData.append("tags", tag));
  zfd.formData(blogFormSchema).parse(formData);
  return formData;
}
