import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeKeys<T extends object = object>(source: T): Array<keyof T> {
  return Object.keys(source) as Array<keyof T>;
}

export function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "") // drop quotes
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics -> -
    .replace(/^-+|-+$/g, "");
}
