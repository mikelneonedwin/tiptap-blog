"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EditorSidebar from "../components/editor/editor-sidebar";
import EditorView from "../components/editor/editor-view";
import EditorProvider, { useEditorTab } from "../providers/editor-provider";

function ActiveTab() {
  const { activeTab } = useEditorTab();
  return <>{activeTab === "edit" && <EditorView />}</>;
}

export default function NewBlogPost() {
  return (
    <EditorProvider>
      <SidebarProvider>
        <SidebarInset>
          {/*<header className="bg-background sticky top-0 flex shrink-0 items-center justify-between border-b py-2.5 px-4 gap-4">
            Blog Editor
          </header>*/}

          <div className="flex flex-1 flex-col gap-4 p-4">
            <ActiveTab />
          </div>
        </SidebarInset>
        <EditorSidebar />
      </SidebarProvider>
    </EditorProvider>
  );
}
