import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import BlogSidebar from "./blog-sidebar";

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
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BlogDashboardLayout;
