"use client";

import { blogEditorExtensions as tipTapExtensions } from "@/features/blog/editor-extensions";
import type { blogFormSchema } from "../../schemas";
import { EditorContent, useEditor } from "@tiptap/react";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { OldEditorMenu } from "@/features/blog/components/editor/old-editor-menu";

/* ---------------- Content Editor ---------------- */
function ContentEditorCardComponent() {
  const form = useFormContext<z.infer<typeof blogFormSchema>>();

  const editor = useEditor({
    extensions: tipTapExtensions,
    content: form.getValues("content"),
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => form.setValue("content", editor.getHTML()),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content *</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="content"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="border rounded p-2">
                  {editor && <OldEditorMenu editor={editor} />}
                  <Separator />
                  <EditorContent
                    editor={editor}
                    // placeholder="Lets get started..."
                    onClick={(event) => {
                      if (event.target === event.currentTarget) {
                        const element = event.currentTarget.querySelector(
                          "&>*",
                        ) as HTMLDivElement;
                        element.focus();
                      }
                    }}
                    className="min-h-[300px] [&>*]:focus:border-none [&>*]:focus:outline-none px-2 py-3"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export const ContentEditorCard = memo(ContentEditorCardComponent);
