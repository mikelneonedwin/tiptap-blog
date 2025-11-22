import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { looksLikeMarkdown } from "./client-utils";

export const PasteMarkdown = Extension.create({
  name: "pasteMarkdown",

  addProseMirrorPlugins() {
    // capture the editor instance from the extension context
    const editor = this.editor;

    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData("text/plain");
            if (!text) return false;
            if (!looksLikeMarkdown(text)) return false;
            if (!editor) return false;
            // Parse the Markdown text to Tiptap JSON using the Markdown manager
            const json = editor!.markdown!.parse(text);
            // Insert the parsed JSON content at cursor position
            editor!.commands.insertContent(json);
            return true;
          },
        },
      }),
    ];
  },
});

export default PasteMarkdown;
