import { APP_URL } from "./config";
import type { Metadata } from "next";

export function seo({
  title,
  description,
  image,
  twitter,
  openGraph,
  pathname,
  ...metadata
}: Partial<Omit<Metadata, "title">> & {
  title: NonNullable<Metadata["title"]>;
  description: string;
  image?: string;
  pathname?: `/${string}`;
}): Metadata {
  const url = new URL(pathname ?? "/", APP_URL).href;
  return {
    ...metadata,
    title,
    description,
    twitter: {
      ...twitter,
      title,
      description,
      creator: "@appliftlabs",
      site: "@appliftlabs",
      ...(image
        ? {
            images: image,
            card: "summary_large_image",
          }
        : {}),
    },
    openGraph: {
      siteName: "Applift Labs",
      ...openGraph,
      type: "website",
      title,
      description,
      url,
      ...(image
        ? {
            images: image,
          }
        : {}),
    },
  };
}
