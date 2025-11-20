import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// Import the necessary hook
import { useEditorState } from "@/features/blog/providers/editor-provider";
// Remove unused Editor type import
import { FaListOl, FaListUl } from "react-icons/fa";

// Removed props interface

function ListGroup() {
  // Use useEditorState to get all necessary state and actions
  const { isBulletList, isOrderedList, toggleBulletList, toggleOrderedList } =
    useEditorState((ctx) => ({
      // State
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      // Actions
      toggleBulletList: () =>
        ctx.editor.chain().focus().toggleBulletList().run(),
      toggleOrderedList: () =>
        ctx.editor.chain().focus().toggleOrderedList().run(),
    }));

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            // Use state from the hook
            variant={isBulletList ? "default" : "ghost"}
            // Use action from the hook
            onClick={toggleBulletList}
          >
            <FaListUl />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bullet List</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            // Use state from the hook
            variant={isOrderedList ? "default" : "ghost"}
            // Use action from the hook
            onClick={toggleOrderedList}
          >
            <FaListOl />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Numbered List</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}

export default ListGroup;
