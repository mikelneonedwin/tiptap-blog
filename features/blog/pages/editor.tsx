"use client";

// NOTE MOUNT THIS AT /dashboard/blog/new

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import BlogEditor from "../components/editor/blog-editor";
import EditorSidebar from "../components/editor/editor-sidebar";
import BlogViewer from "../components/layout/blog-viewer";
import EditorProvider, {
  useBlogForm,
  useEditorTab,
} from "../providers/editor-provider";

function LoadPostToViwer() {
  const form = useBlogForm();
  const { data: session } = authClient.useSession();
  const now = new Date();
  return (
    <BlogViewer
      isPreview
      post={{
        author: {
          image: session?.user.image ?? "#",
          name: session?.user.name ?? "You",
        },
        authorId: session?.user.id ?? "user-id",
        category: form.getValues("category"),
        content: form.getValues("content"),
        coverImage: form.getValues("coverImage"),
        createdAt: now,
        description: form.getValues("description"),
        id: form.getValues("id") ?? "post-id",
        slug: form.getValues("slug"),
        status: form.getValues("status"),
        tags: form.getValues("tags")?.map((tag) => tag.value) ?? null,
        title: form.getValues("title"),
        updatedAt: now,
      }}
    />
  );
}

function ActiveTab() {
  const { activeTab } = useEditorTab();
  return (
    <>
      <div className="h-svh flex items-center">
        <ScrollArea className="**:h-full bg-card text-card-foreground rounded-md h-[96.25%] w-full py-3 px-4">
          <div className="bg-card h-full">
            {activeTab === "edit" ? <BlogEditor /> : <LoadPostToViwer />}
          </div>
        </ScrollArea>
      </div>
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
