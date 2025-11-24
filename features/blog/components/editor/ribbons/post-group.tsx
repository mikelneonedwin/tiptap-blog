"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPublicBlogPostUrl } from "@/features/blog/client-utils";
import { useDeleteBlogPostMutation } from "@/features/blog/mutations";
import {
  useBlogForm,
  useEditorTab,
} from "@/features/blog/providers/editor-provider";
import { useIsUpdatingPost } from "@/features/blog/providers/post-to-edit-provider";
import {
  Eraser,
  Eye,
  Pencil,
  Save,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback } from "react";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";

const PostGroup = () => {
  const { setActiveTab, activeTab } = useEditorTab();
  const isUpdatingPost = useIsUpdatingPost();
  const form = useBlogForm();
  const deleteMutation = useDeleteBlogPostMutation();
  const status = useWatch({
    control: form.control,
    name: "status",
  });
  const slug = useWatch({
    control: form.control,
    name: "slug",
  });
  const handleShare = useCallback(async () => {
    const shareUrl = new URL(
      getPublicBlogPostUrl(form.getValues("slug")),
      window.location.href,
    ).href;
    const title = form.getValues("title");
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this blog post: ${title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!", {
          description: "The blog link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Unable to share blog post", error);
      toast.error("Unable to share", {
        description: "Something went wrong while trying to share this post.",
      });
    }
  }, [form]);

  const canShare =
    isUpdatingPost?.status === "published" &&
    status === "published" &&
    isUpdatingPost.slug === slug;
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            size="icon"
            type="button"
            onClick={() => setActiveTab("preview")}
          >
            <Eye />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preview</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={activeTab === "edit" ? "default" : "outline"}
            size="icon"
            type="button"
            onClick={() => setActiveTab("edit")}
          >
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" type="submit">
            {isUpdatingPost ? <Upload /> : <Save />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isUpdatingPost ? "Update" : "Save"}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            disabled={!canShare}
            type="button"
          >
            <Share2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            type="button"
            onClick={() => {
              if (!isUpdatingPost) form.reset();
              else deleteMutation.mutate(isUpdatingPost.postId);
            }}
          >
            {isUpdatingPost ? <Trash2 /> : <Eraser />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isUpdatingPost ? "Delete" : "Reset"}</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default PostGroup;
