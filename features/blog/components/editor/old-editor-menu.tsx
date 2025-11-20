"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor, useEditorState } from "@tiptap/react";
import {
    Image,
    LayoutPanelTop,
    Type,
    Zap,
    type LucideIcon,
} from "lucide-react";
import {
    FaImage,
    FaLink,
    FaTable,
    FaTasks,
    FaVideo
} from "react-icons/fa";

const tabs: {
  label: string;
  value: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Formatting",
    value: "formatting",
    icon: Type,
  },
  {
    label: "Blocks",
    value: "blocks",
    icon: LayoutPanelTop,
  },
  {
    label: "Media",
    value: "media",
    icon: Image,
  },
  {
    label: "Actions",
    value: "actions",
    icon: Zap,
  },
];

export function OldEditorMenu({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      canBold: ctx.editor.can().chain().toggleBold().run(),
      isItalic: ctx.editor.isActive("italic"),
      canItalic: ctx.editor.can().chain().toggleItalic().run(),
      isStrike: ctx.editor.isActive("strike"),
      canStrike: ctx.editor.can().chain().toggleStrike().run(),
      isCode: ctx.editor.isActive("code"),
      canCode: ctx.editor.can().chain().toggleCode().run(),
      isUnderline: ctx.editor.isActive("underline"),
      canUnderline: ctx.editor.can().chain().toggleUnderline().run(),
      isParagraph: ctx.editor.isActive("paragraph"),
      isHeading1: ctx.editor.isActive("heading", { level: 1 }),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isHeading3: ctx.editor.isActive("heading", { level: 3 }),
      isHeading4: ctx.editor.isActive("heading", { level: 4 }),
      isHeading5: ctx.editor.isActive("heading", { level: 5 }),
      isHeading6: ctx.editor.isActive("heading", { level: 6 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      textAlign: ctx.editor.getAttributes("paragraph").textAlign || "left",
      canUndo: ctx.editor.can().chain().undo().run(),
      canRedo: ctx.editor.can().chain().redo().run(),
      isTaskList: ctx.editor.isActive("taskList"),
      isSubscript: ctx.editor.isActive("subscript"),
      isSuperscript: ctx.editor.isActive("superscript"),
      hasLink: ctx.editor.isActive("link"),
    }),
  });

  if (!editor) return null;

  return (
    <Tabs defaultValue="formatting" className="mb-2">
      <TabsList className="w-full p-1 md:bg-transparent h-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="md:!py-2 md:px-3 /max-md:!justify-start"
          >
            <tab.icon className="hidden md:inline-block" />
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Blocks */}
      <TabsContent value="blocks" className="flex flex-wrap gap-2 mt-2">
        <Button
          type="button"
          size="icon"
          variant={state.isTaskList ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="Task List"
        >
          <FaTasks />
        </Button>
      </TabsContent>

      {/* Media */}
      <TabsContent value="media" className="flex flex-wrap gap-2 mt-2">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          title="Add Image"
        >
          <FaImage />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={() => {
            const url = prompt("Enter YouTube URL");
            if (url)
              editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
              });
          }}
          title="Add YouTube Video"
        >
          <FaVideo />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={() => {
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
          }}
          title="Insert Table"
        >
          <FaTable />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={state.hasLink ? "default" : "ghost"}
          onClick={() => {
            const href = prompt("Enter link URL");
            if (href) editor.chain().focus().setLink({ href }).run();
          }}
          title="Add Link"
        >
          <FaLink />
        </Button>
      </TabsContent>

      {/* Actions */}
      <TabsContent value="actions" className="flex flex-wrap gap-2 mt-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().insertLinkButton().run()}
          title="Insert Link Button"
        >
          <Zap className="size-5" />
        </Button>
      </TabsContent>
    </Tabs>
  );
}
