"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import the self-sufficient state hook
import { useEditorState } from "@/features/blog/providers/editor-provider";
import { useState } from "react";
import {
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaTint,
  FaUnderline,
} from "react-icons/fa";
import { toast } from "sonner";
import { ColorPicker } from "../../misc/color-picker";
// Removed type import for Editor as it's only used internally in the selector

// Removed FormattingRibbonProps interface

function FormattingGroup() {
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [openHighlight, setOpenHighlight] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  // 1. Yank out all state (isActive, can) and actions into the selector
  const {
    // State (isActive)
    isBold,
    isItalic,
    isStrike,
    isUnderline,
    isSuperscript,
    isSubscript,
    isCode,
    // State (can)
    canBold,
    canItalic,
    canStrike,
    canSuperscript,
    canSubscript,
    canCode,
    // Actions
    toggleBold,
    toggleItalic,
    toggleStrike,
    toggleUnderline,
    toggleSuperscript,
    toggleSubscript,
    toggleCode,
    toggleHighlight,
    setColor,
  } = useEditorState((ctx) => ({
    // STATE (isActive)
    isBold: ctx.editor.isActive("bold"),
    isItalic: ctx.editor.isActive("italic"),
    isStrike: ctx.editor.isActive("strike"),
    isUnderline: ctx.editor.isActive("underline"),
    isSuperscript: ctx.editor.isActive("superscript"),
    isSubscript: ctx.editor.isActive("subscript"),
    isCode: ctx.editor.isActive("code"),

    // STATE (can)
    canBold: ctx.editor.can().toggleBold(),
    canItalic: ctx.editor.can().toggleItalic(),
    canStrike: ctx.editor.can().toggleStrike(),
    canSuperscript: ctx.editor.can().toggleSuperscript(),
    canSubscript: ctx.editor.can().toggleSubscript(),
    canCode: ctx.editor.can().toggleCode(),

    // ACTIONS (All Tiptap commands are bound here)
    toggleBold: () => ctx.editor.chain().focus().toggleBold().run(),
    toggleItalic: () => ctx.editor.chain().focus().toggleItalic().run(),
    toggleStrike: () => ctx.editor.chain().focus().toggleStrike().run(),
    toggleUnderline: () => ctx.editor.chain().focus().toggleUnderline().run(),
    toggleSuperscript: () =>
      ctx.editor.chain().focus().toggleSuperscript().run(),
    toggleSubscript: () => ctx.editor.chain().focus().toggleSubscript().run(),
    toggleCode: () => ctx.editor.chain().focus().toggleCode().run(),
    toggleHighlight: (color: string) =>
      ctx.editor.chain().focus().toggleHighlight({ color }).run(),
    setColor: (color: string) =>
      ctx.editor.chain().focus().setColor(color).run(),
  }));

  return (
    <>
      <Dialog open={openHighlight} onOpenChange={setOpenHighlight}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setOpenHighlight(true)}
              >
                <FaHighlighter />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Highlight</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="max-w-sm!"
        >
          <DialogHeader>
            <DialogTitle>Pick a Highlight Color</DialogTitle>
            <DialogDescription>
              Pick a highlight color for your text.
            </DialogDescription>
          </DialogHeader>

          <ColorPicker value={pickedColor} onChange={setPickedColor} />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  if (!pickedColor) {
                    return toast.error("Please pick a valid color!");
                  }
                  // Use the action from useEditorState
                  toggleHighlight(pickedColor);
                }}
              >
                Apply
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openColor} onOpenChange={setOpenColor}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setOpenColor(true)}
              >
                <FaTint />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Text Color</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="max-w-sm!"
        >
          <DialogHeader>
            <DialogTitle>Choose Text Color</DialogTitle>
            <DialogDescription>
              Choose a color below to apply to your text.
            </DialogDescription>
          </DialogHeader>
          <ColorPicker value={pickedColor} onChange={setPickedColor} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  if (!pickedColor) {
                    return toast.error("Please pick a valid color!");
                  }
                  // Use the action from useEditorState
                  setColor(pickedColor);
                }}
              >
                Apply
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={isBold ? "default" : "ghost"}
            onClick={toggleBold}
            disabled={!canBold}
          >
            <FaBold />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={isItalic ? "default" : "ghost"}
            onClick={toggleItalic}
            disabled={!canItalic}
          >
            <FaItalic />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Italic</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={isUnderline ? "default" : "ghost"}
            onClick={toggleUnderline}
          >
            <FaUnderline />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Underline</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={isStrike ? "default" : "ghost"}
            onClick={toggleStrike}
            disabled={!canStrike}
          >
            <FaStrikethrough />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Strikethrough</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            disabled={!canSuperscript}
            variant={isSuperscript ? "default" : "ghost"}
            onClick={toggleSuperscript}
          >
            <FaSuperscript />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Superscript</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            disabled={!canSubscript}
            variant={isSubscript ? "default" : "ghost"}
            onClick={toggleSubscript}
          >
            <FaSubscript />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Subscript</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={isCode ? "default" : "ghost"}
            onClick={toggleCode}
            disabled={!canCode}
          >
            <FaCode />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Inline Code</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}

export default FormattingGroup;
