import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import BlogSidebar from "./blog-sidebar";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const BlogDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <BlogSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <ModeToggle />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BlogDashboardLayout;
