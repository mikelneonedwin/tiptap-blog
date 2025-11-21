import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorState } from "@/features/blog/providers/editor-provider";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
} from "react-icons/fa";

const alignments = [
  { label: "left", icon: FaAlignLeft },
  { label: "center", icon: FaAlignCenter },
  { label: "right", icon: FaAlignRight },
  { label: "justify", icon: FaAlignJustify },
] as const;

type Alignment = (typeof alignments)[number]["label"];

function AlignmentGroup() {
  const { isActive, canAlign, setTextAlign } = useEditorState((ctx) => ({
    isActive: (align: Alignment) => ctx.editor.isActive({ textAlign: align }),
    canAlign: (align: Alignment) => ctx.editor.can().setTextAlign(align),
    setTextAlign: (align: Alignment) =>
      ctx.editor.chain().focus().setTextAlign(align).run(),
  }));
  return alignments.map(({ label, icon: Icon }) => {
    const active = isActive(label);
    const canDo = canAlign(label);
    return (
      <Tooltip key={label}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={active ? "default" : "ghost"}
            disabled={!canDo}
            onClick={() => setTextAlign(label)}
          >
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">
            {label !== "justify" && "Align "}
            {label}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  });
}

export default AlignmentGroup;
