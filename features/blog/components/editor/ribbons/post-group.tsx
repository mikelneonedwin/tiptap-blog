"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorTab } from "@/features/blog/providers/editor-provider";
import { Eye, Pencil, Save, Trash2 } from "lucide-react";

const PostGroup = () => {
  const { setActiveTab, activeTab } = useEditorTab();
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
          <Button variant="secondary" size="icon">
            <Save />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default PostGroup;
