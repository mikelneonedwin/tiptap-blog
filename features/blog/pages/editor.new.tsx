import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Eye, Pencil, Save, Trash2 } from "lucide-react";

// TODO
export default function NewBlogPost() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center justify-end border-b py-2.5 px-4">
          <div className="lg:hidden flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Eye />
            </Button>
            <Button variant="outline" size="icon">
              <Pencil />
            </Button>
            <Button variant="secondary" size="icon">
              <Save />
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2 />
            </Button>
          </div>
          <div className="max-lg:hidden flex items-center gap-2">
            <Button variant="outline">
              <span>Preview</span>
              <Eye />
            </Button>
            <Button variant="outline">
              <span>Edit</span>
              <Pencil />
            </Button>
            <Button variant="secondary">
              <span>Save</span>
              <Save />
            </Button>
            <Button variant="destructive">
              <span>Delete</span>
              <Trash2 />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
