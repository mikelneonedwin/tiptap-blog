import type { BlogCategory } from "@/generated/prisma";
import { type BlogFormOutput } from "./schemas";
import type { CroppedImageArea } from "./types";

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
  return formData;
}

export function getCroppedDataUrl(
  image: HTMLImageElement,
  area: CroppedImageArea,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height,
  );

  return canvas.toDataURL("image/png"); // you can change format to "image/jpeg" if desired
}

export function looksLikeMarkdown(text: string): boolean {
  // Simple heuristic: check for Markdown syntax
  return (
    /^#{1,6}\s/.test(text) || // Headings
    /\*\*[^*]+\*\*/.test(text) || // Bold
    /\[.+\]\(.+\)/.test(text) || // Links
    /^[-*+]\s/.test(text)
  ); // Lists
}

export function formatDateToDayMonthDateOrdinalYear(date: Date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Add ordinal suffix: 1st, 2nd, 3rd, 4th...
  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${dayName}, ${monthName} ${ordinal(day)} ${year}`;
}

export function blogCategoryUrl(category: BlogCategory | "All") {
  return category === "All" ? "/blog" : `/blog/${category.toLowerCase()}`;
}

export function getPublicBlogPostUrl(slug: string) {
  return `/blog/post/${slug}`;
}

export function getEditBlogPostUrl(postId: string) {
  return `/dashboard/blog/edit/${postId}`;
}
