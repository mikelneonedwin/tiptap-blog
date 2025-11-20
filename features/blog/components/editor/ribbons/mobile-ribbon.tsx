import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "lucide-react";
import ActionsGroup from "./actions-group";
import AlignmentGroup from "./alignment-group";
import BlockGroup from "./block-group";
import FormattingGroup from "./formatting-group";
import ListGroup from "./list-group";

const MobileRibbon = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className="rounded-full fixed bottom-4 right-4"
        >
          <Text />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem>
          <Popover>
            <PopoverTrigger>Formatting</PopoverTrigger>
            <PopoverContent>
              <ButtonGroup
                orientation="vertical"
                aria-label="Format options"
                className="h-fit"
              >
                <FormattingGroup />
              </ButtonGroup>
            </PopoverContent>
          </Popover>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Popover>
            <PopoverTrigger>Alignment</PopoverTrigger>
            <PopoverContent>
              <ButtonGroup
                orientation="vertical"
                aria-label="Alignment options"
                className="h-fit"
              >
                <AlignmentGroup />
              </ButtonGroup>
            </PopoverContent>
          </Popover>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Popover>
            <PopoverTrigger>Lists</PopoverTrigger>
            <PopoverContent>
              <ButtonGroup
                orientation="vertical"
                aria-label="List options"
                className="h-fit"
              >
                <ListGroup />
              </ButtonGroup>
            </PopoverContent>
          </Popover>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Popover>
            <PopoverTrigger>Block Type</PopoverTrigger>
            <PopoverContent>
              <ButtonGroup
                orientation="vertical"
                aria-label="Block type options"
                className="h-fit"
              >
                <BlockGroup />
              </ButtonGroup>
            </PopoverContent>
          </Popover>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Popover>
            <PopoverTrigger>Actions</PopoverTrigger>
            <PopoverContent>
              <ActionsGroup />
            </PopoverContent>
          </Popover>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileRibbon;
