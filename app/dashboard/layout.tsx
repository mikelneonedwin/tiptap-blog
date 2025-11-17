import AppSidebar from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BlogSidebarGroups from "@/features/blog/components/layout/blog-sidebar-groups";
import { usersBlogPostOptions } from "@/features/blog/query-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "../get-query-client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(usersBlogPostOptions);
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <BlogSidebarGroups />
          </HydrationBoundary>
        </AppSidebar>
        <main className="w-full">
          <div className="px-2.5">
            <div className="flex items-center pt-2 max-md:justify-end">
              {/*<ThemeToggle />*/}
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
