"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogCategoryEnumArray } from "@/generated/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus, Save, Send, Trash, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { memo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { deleteBlogPost as deleteFn } from "../../actions";
import { usersBlogPostOptions } from "../../query-options";
import type { newBlogSchema } from "../../schemas";

function EditorPaneComponent() {
  const form = useFormContext<z.infer<typeof newBlogSchema>>();
  const [newTag, setNewTag] = useState("");
  const submitBtn = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const title = useWatch({ control: form.control, name: "title" });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onMutate: (data) => {
      toast.loading(`Deleting "${title}"`, {
        id: data.id,
        description: "",
      });
    },
    onSuccess: async (_, data) => {
      toast.success(`Deleted "${title}" successfully!`, {
        id: data.id,
        description: "",
      });
      form.reset();
      queryClient.setQueryData(usersBlogPostOptions.queryKey, (posts) => {
        if (!posts) return [];
        return posts.filter((post) => post.id !== data.id);
      });
      router.replace("/editor/new");
    },
    onError: async (error, data) => {
      const item = isPublished ? "post" : "draft";
      console.error(`Error deleting "${title}"`, error);
      toast.error(`Unable to delete ${item}: "${title}"`, {
        id: data.id,
        description: error.message,
      });
    },
  });

  const postId = useWatch({ control: form.control, name: "id" });
  const isPublished =
    useWatch({ control: form.control, name: "status" }) === "published";
  const existingTags = useWatch({ control: form.control, name: "tags" });

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !existingTags?.includes(tag)) {
      form.setValue("tags", [...(existingTags || []), tag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    form.setValue("tags", existingTags?.filter((t) => t !== tag) || []);
  };

  return (
    <fieldset
      className="space-y-6"
      disabled={deleteMutation.isPending || undefined}
    >
      <button hidden type="submit" ref={submitBtn} />
      {/* Publish card */}
      <Card>
        <CardHeader>
          <CardTitle>Publish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              form.setValue("status", "drafted");
              submitBtn.current?.click();
            }}
          >
            <Save className="size-4 mr-2" />
            {isPublished
              ? "Convert to Draft"
              : postId
                ? "Update Draft"
                : "Save as Draft"}
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              form.setValue("status", "published");
              submitBtn.current?.click();
            }}
          >
            <Send className="size-4 mr-2" />
            {isPublished ? "Update Post" : "Publish as a Post"}
          </Button>
          {!postId && (
            <Button
              type="reset"
              className="w-full"
              variant="destructive"
              onClick={() => {
                form.reset();
              }}
            >
              <Loader className="size-4 mr-2" />
              Reset
            </Button>
          )}
          {postId && (
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() =>
                // TODO use a dialog to confirm post deletion
                deleteMutation.mutate({ id: postId })
              }
            >
              <Trash className="size-4 mr-2" />
              Delete
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Meta (Category + Tags) card */}
      <Card>
        <CardHeader>
          <CardTitle>Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BlogCategoryEnumArray.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <div>
            <FormLabel>Tags</FormLabel>
            <div className="flex gap-2 mt-2 mb-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button variant="outline" size="icon" onClick={addTag}>
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {existingTags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </fieldset>
  );
}

export const EditorPane = memo(EditorPaneComponent);
