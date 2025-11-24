// MOUNT AT dashboard/blog/layout.tsx
// SHOULD NOT BE WRAPPED IN ANY LAYOUT THAT HAS ITS OWN SIDEBAR

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import BlogSidebar from "../components/layout/blog-sidebar";

const DashboardBlogLayout = ({ children }: { children: ReactNode }) => {
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

export default DashboardBlogLayout;
