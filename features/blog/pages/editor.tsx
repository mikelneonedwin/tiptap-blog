"use client";

// NOTE MOUNT THIS AT /dashboard/blog/new

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import BlogEditor from "../components/editor/blog-editor";
import EditorSidebar from "../components/editor/editor-sidebar";
import MobileRibbon from "../components/editor/ribbons/mobile-ribbon";
import EditorProvider, { useEditorTab } from "../providers/editor-provider";

function ActiveTab() {
  const { activeTab } = useEditorTab();
  return (
    <>
      {activeTab === "edit" && (
        <div className="h-svh flex items-center">
          <ScrollArea className="**:h-full bg-card text-card-foreground rounded-md h-[96.25%] w-full py-3 px-4">
            <div className="bg-card h-full">
              <MobileRibbon />
              <BlogEditor />
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}

export default function BlogEditorLayout() {
  return (
    <EditorProvider>
      <SidebarProvider>
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 px-4">
            <ActiveTab />
          </div>
        </SidebarInset>
        <EditorSidebar />
      </SidebarProvider>
    </EditorProvider>
  );
}
