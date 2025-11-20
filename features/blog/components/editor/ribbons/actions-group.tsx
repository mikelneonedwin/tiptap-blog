import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import the necessary hook
import { useEditorState } from "@/features/blog/providers/editor-provider";
// Remove unused Editor type import
import { FaEraser, FaRedo, FaUndo } from "react-icons/fa";

// Removed ActionsRibbonProps interface

function ActionsGroup() {
  // Use useEditorState to get all necessary state and actions
  const { canUndo, canRedo, undo, redo, clearFormatting } = useEditorState(
    (ctx) => ({
      // State
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
      // Actions
      undo: () => ctx.editor.chain().focus().undo().run(),
      redo: () => ctx.editor.chain().focus().redo().run(),
      clearFormatting: () =>
        ctx.editor.chain().focus().unsetAllMarks().clearNodes().run(),
    }),
  );

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            // Use the action from the hook
            onClick={undo}
            // Use the state from the hook
            disabled={!canUndo}
          >
            <FaUndo />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            // Use the action from the hook
            onClick={redo}
            // Use the state from the hook
            disabled={!canRedo}
          >
            <FaRedo />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Redo</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            // Use the action from the hook
            onClick={clearFormatting}
          >
            <FaEraser />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear Formatting</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}

export default ActionsGroup;
