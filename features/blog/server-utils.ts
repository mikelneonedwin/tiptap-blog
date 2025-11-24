import { cloudinary } from "@/lib/cloudinary";
import { CLOUDINARY_FOLDER_PREFIX } from "./constants";

export async function blobToDataURL(blob: Blob) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mime = blob.type || "application/octet-stream";
  return `data:${mime};base64,${base64}`;
}

export async function uploadBlogPostCoverImage(
  dataUrl: string,
  postId: string,
) {
  const result = await cloudinary.uploader.upload(dataUrl, {
    public_id: `${CLOUDINARY_FOLDER_PREFIX}/${postId}`,
    auto_tagging: 0.8,
    overwrite: true,
  });
  return result.secure_url;
}

export async function deleteBlogPostCoverImage(url: string) {
  const parts = url.split(CLOUDINARY_FOLDER_PREFIX);
  if (parts.length < 2) return;
  const suffix = parts.slice(1).join(CLOUDINARY_FOLDER_PREFIX);
  const publicId = `${CLOUDINARY_FOLDER_PREFIX}/${suffix}`;
  await cloudinary.uploader.destroy(publicId);
}
