import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import the necessary hook
import { useEditorState } from "@/features/blog/providers/editor-provider";
// Remove unused Editor type import
import { FaParagraph, FaQuoteRight } from "react-icons/fa";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";

const headings = [
  {
    level: 1,
    icon: LuHeading1,
  },
  {
    level: 2,
    icon: LuHeading2,
  },
  {
    level: 3,
    icon: LuHeading3,
  },
  {
    level: 4,
    icon: LuHeading4,
  },
  {
    level: 5,
    icon: LuHeading5,
  },
  {
    level: 6,
    icon: LuHeading6,
  },
] as const;

type Level = (typeof headings)[number]["level"];

function BlockGroup() {
  const {
    isParagraph,
    setParagraph,
    isBlockquote,
    toggleBlockquote,
    isHeading,
    toggleHeading,
  } = useEditorState((ctx) => ({
    // State
    isParagraph: ctx.editor.isActive("paragraph"),
    isBlockquote: ctx.editor.isActive("blockquote"),
    // A single function to check if a specific heading level is active
    isHeading: (level: Level) => ctx.editor.isActive("heading", { level }),
    // Actions
    setParagraph: () => ctx.editor.chain().focus().setParagraph().run(),
    toggleBlockquote: () => ctx.editor.chain().focus().toggleBlockquote().run(),
    // A single action creator for all heading levels
    toggleHeading: (level: Level) =>
      ctx.editor.chain().focus().toggleHeading({ level }).run(),
  }));

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            // Use state from the hook
            variant={isParagraph ? "default" : "ghost"}
            // Use action from the hook
            onClick={setParagraph}
          >
            <FaParagraph />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Paragraph</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            // Use state from the hook
            variant={isBlockquote ? "default" : "ghost"}
            // Use action from the hook
            onClick={toggleBlockquote}
          >
            <FaQuoteRight />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Blockquote</p>
        </TooltipContent>
      </Tooltip>
      {headings.map(({ level, icon: Icon }) => (
        <Tooltip key={level}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              // Use the isHeading check function
              variant={isHeading(level) ? "default" : "ghost"}
              // Use the toggleHeading action function
              onClick={() => toggleHeading(level)}
            >
              <Icon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading {level}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

export default BlockGroup;
