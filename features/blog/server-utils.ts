import { cloudinary } from "@/lib/cloudinary";

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
    public_id: `blog/${postId}`,
    auto_tagging: 0.8,
  });
  return result.secure_url;
}
