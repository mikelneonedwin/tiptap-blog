"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteBlogPostMutation } from "@/features/blog/mutations";
import {
  useBlogForm,
  useEditorTab,
} from "@/features/blog/providers/editor-provider";
import { useIsUpdatingPost } from "@/features/blog/providers/post-to-edit-provider";
import { Eye, Pencil, Save, Trash2, Upload } from "lucide-react";

const PostGroup = () => {
  const { setActiveTab, activeTab } = useEditorTab();
  const isUpdatingPost = useIsUpdatingPost();
  const form = useBlogForm();
  const deleteMutation = useDeleteBlogPostMutation();
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            size="icon"
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
          <Button variant="secondary" size="icon" type="submit">
            {isUpdatingPost ? <Upload /> : <Save />}
            <Save />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isUpdatingPost ? "Update" : "Save"}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              if (!isUpdatingPost) return form.reset();
              deleteMutation.mutate(isUpdatingPost.postId);
            }}
          >
            <Trash2 />
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
