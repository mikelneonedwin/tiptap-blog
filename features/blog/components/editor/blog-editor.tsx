import { EditorContent } from "@tiptap/react";
import { memo, useState } from "react";
import { useEditor } from "../../providers/editor-provider";

const BlogEditor = memo(function BlogEditor() {
  const editor = useEditor();
  const [hasClearedPlaceholder, setHasClearedPlaceholder] = useState(false);
  return (
    <div className="border rounded p-2">
      <EditorContent
        editor={editor}
        // placeholder="Lets get started..."
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const element = event.currentTarget.querySelector(
            "&>*",
          ) as HTMLDivElement;
          element.focus();
          if (hasClearedPlaceholder) return;
          element.innerText = "";
          setHasClearedPlaceholder(true);
        }}
        className="min-h-[300px] *:focus:border-none *:focus:outline-none px-2 py-3"
      />
    </div>
  );
});

export default BlogEditor;
