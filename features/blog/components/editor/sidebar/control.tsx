import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import ActionsGroup from "../ribbons/actions-group";
import AlignmentGroup from "../ribbons/alignment-group";
import BlockGroup from "../ribbons/block-group";
import FormattingGroup from "../ribbons/formatting-group";
import ListGroup from "../ribbons/list-group";
import PostGroup from "../ribbons/post-group";

const CollapsibleGroup = ({
  title,
  children,
  evenly,
}: {
  title: string;
  children: React.ReactNode;
  evenly?: boolean;
}) => (
  <Collapsible defaultOpen className="group/collapsible">
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <CollapsibleTrigger className="w-full justify-between">
          {title}
          <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </CollapsibleTrigger>
      </SidebarGroupLabel>
      <CollapsibleContent>
        <SidebarGroupContent>
          <div
            className={clsx(
              "px-2 py-1 space-x-1 space-y-1",
              evenly && "flex items-center justify-evenly",
            )}
          >
            {children}
          </div>
        </SidebarGroupContent>
      </CollapsibleContent>
    </SidebarGroup>
  </Collapsible>
);

export const EditorControlsTab = () => {
  return (
    <>
      <CollapsibleGroup title="Blocks & Headings">
        <BlockGroup />
      </CollapsibleGroup>

      <CollapsibleGroup title="Lists">
        <ListGroup />
      </CollapsibleGroup>

      <CollapsibleGroup title="Alignment">
        <AlignmentGroup />
      </CollapsibleGroup>

      <CollapsibleGroup title="Formatting">
        <FormattingGroup />
      </CollapsibleGroup>

      <CollapsibleGroup title="Editor Actions">
        <ActionsGroup />
      </CollapsibleGroup>

      <CollapsibleGroup title="Post Actions" evenly>
        <PostGroup />
      </CollapsibleGroup>
    </>
  );
};
