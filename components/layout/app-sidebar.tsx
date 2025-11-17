"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bell,
  Briefcase,
  FolderPlus,
  Home,
  Pencil,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const AppSidebar = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {/* Core navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/blog">
                  <SidebarMenuButton>
                    <Home />
                    Company Blog
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/editor/new">
                  <SidebarMenuButton isActive={pathname === "/editor/new"}>
                    <Pencil />
                    Compose
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/editor/projects/new">
                  <SidebarMenuButton
                    isActive={pathname === "/editor/projects/new"}
                  >
                    <FolderPlus />
                    Add Project
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/editor/projects">
                  <SidebarMenuButton isActive={pathname === "/editor/projects"}>
                    <Briefcase />
                    My Projects
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User-specific navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/editor/settings">
                  <SidebarMenuButton isActive={pathname === "/editor/settings"}>
                    <Settings />
                    Settings
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <Link href="/editor/my-blogs">
                <SidebarMenuButton isActive={pathname === "/editor/my-blogs"}>
                  <User />
                  My Blogs
                </SidebarMenuButton>
              </Link>
              <Link href="/editor/notifications">
                <SidebarMenuButton
                  isActive={pathname === "/editor/notifications"}
                >
                  <Bell />
                  Notifications
                </SidebarMenuButton>
              </Link>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {children}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
