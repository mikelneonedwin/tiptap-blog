import { Field, FieldError } from "@/components/ui/field";
import { EditorContent } from "@tiptap/react";
import { memo, useState } from "react";
import { Controller } from "react-hook-form";
import { useBlogForm, useEditor } from "../../providers/editor-provider";
import { useIsUpdatingPost } from "../../providers/post-to-edit-provider";

const BlogEditor = memo(function BlogEditor() {
  const editor = useEditor();
  const isUpdatingPost = useIsUpdatingPost();
  const [hasClearedPlaceholder, setHasClearedPlaceholder] = useState(
    Boolean(isUpdatingPost),
  );
  const form = useBlogForm();
  return (
    <Controller
      control={form.control}
      name="content"
      render={({ fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <EditorContent
            editor={editor}
            onClickCapture={(event) => {
              const element = event.currentTarget.querySelector(
                "&>*",
              ) as HTMLDivElement;
              element.focus();
              if (hasClearedPlaceholder) return;
              element.innerText = "";
              setHasClearedPlaceholder(true);
            }}
            className="h-full *:focus:border-none *:focus:outline-none **:h-auto!"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
});

export default BlogEditor;
