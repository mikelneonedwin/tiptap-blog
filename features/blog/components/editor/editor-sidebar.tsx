"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorControlsTab } from "./sidebar/control";
import EditorMetadataTab from "./sidebar/metadata";

export default function EditorSidebar() {
  return (
    <Tabs defaultValue="controls" asChild>
      <Sidebar collapsible="icon" side="right">
        <SidebarHeader className="pb-4">
          <TabsList className="w-60 mx-auto">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
        </SidebarHeader>

        <SidebarContent>
          <TabsContent value="controls">
            <EditorControlsTab />
          </TabsContent>
          <TabsContent value="metadata">
            <EditorMetadataTab />
          </TabsContent>
        </SidebarContent>
      </Sidebar>
    </Tabs>
  );
}
