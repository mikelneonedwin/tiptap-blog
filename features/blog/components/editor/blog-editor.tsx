import { Field, FieldError } from "@/components/ui/field";
import { EditorContent } from "@tiptap/react";
import { memo, useState } from "react";
import { Controller } from "react-hook-form";
import { useBlogForm, useEditor } from "../../providers/editor-provider";

const BlogEditor = memo(function BlogEditor() {
  const editor = useEditor();
  const [hasClearedPlaceholder, setHasClearedPlaceholder] = useState(false);
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
            className="h-full *:focus:border-none *:focus:outline-none"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
});

export default BlogEditor;
