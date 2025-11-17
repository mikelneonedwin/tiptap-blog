import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Spinner2 } from "@/components/ui/spinner";
import { usersBlogPostOptions } from "@/features/blog/query-options";
import type { BlogStatus } from "@/generated/prisma";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { PostListType } from "../../types";

// TODO DELETE BUTTON FOR POSTS
const PostList = ({ label, posts }: { posts: PostListType; label: string }) => {
  const pathname = usePathname();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="capitalize">{label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {posts.map((post) => {
              const path = `/dashboard/editor/edit/${post.id}`;
              return (
                <Link key={post.id} href={path}>
                  <SidebarMenuButton
                    isActive={path === pathname}
                    className="line-clamp-1"
                  >
                    {post.title}
                  </SidebarMenuButton>
                </Link>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

const BlogSidebarGroups = () => {
  const { data: posts, isLoading } = useSuspenseQuery(usersBlogPostOptions);
  const { drafted, published } = useMemo((): Record<
    BlogStatus,
    PostListType
  > => {
    return {
      drafted: posts.filter((post) => post.status === "drafted"),
      published: posts.filter((post) => post.status === "published"),
    };
  }, [posts]);

  if (isLoading)
    return (
      <SidebarGroup>
        <SidebarGroupContent className="flex items-center gap-4">
          <Spinner2 />
        </SidebarGroupContent>
      </SidebarGroup>
    );

  if (!posts.length) return null;

  return (
    <>
      {published.length > 0 && <PostList label="Published" posts={published} />}
      {drafted.length > 0 && <PostList label="Drafts" posts={drafted} />}
    </>
  );
};

export default BlogSidebarGroups;
