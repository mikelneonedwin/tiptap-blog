"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlogCategoryEnumArray, BlogStatusEnumArray } from "@/generated/enums";
import type { BlogCategory, BlogStatus } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  CheckCircle,
  Feather,
  FilePen,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  HelpCircle,
  Layers,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  Package,
  Plus,
  Rocket,
  Scale,
  SearchX,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState, type ComponentProps } from "react";
import { usersBlogPostOptions } from "../../query-options";
import type { ListedPost } from "../../types";
import { Spinner } from "@/components/ui/spinner";

const categoryIconMap: Record<BlogCategory | BlogStatus, LucideIcon> = {
  Company: Building2,
  Product: Package,
  Tutorial: GraduationCap,
  Engineering: Settings,
  Opinion: MessageSquare,
  Research: FlaskConical,
  Launch: Rocket,
  Culture: UsersRound,
  Marketing: Megaphone,
  Event: CalendarDays,
  FAQ: HelpCircle,
  Storytelling: Feather,
  Policy: Scale,
  Playground: Gamepad2,
  published: CheckCircle,
  drafted: FilePen,
};

function StatusFilterIcon({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={onClick}
          data-state={active ? "active" : "inactive"}
          className={cn(
            "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            "rounded-none first:rounded-t-md last:rounded-b-md bg-background h-10 w-11 p-0",
            "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          )}
        >
          <Icon className="size-5" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

type ActiveItem = BlogCategory | BlogStatus;

function BlogPostlistSidebar({
  activeItem,
  posts,
}: {
  activeItem: ActiveItem;
  posts: ListedPost[];
}) {
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const postsToShow = useMemo(() => {
    if (statusFilter === "all") return posts;
    return posts.filter((post) => post.status === statusFilter);
  }, [posts, statusFilter]);
  return (
    <>
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        {/* TODO SEARCH BAR */}
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium capitalize">
              {activeItem}
            </div>
            {activeItem !== "published" && activeItem !== "drafted" && (
              <div className="bg-muted text-muted-foreground items-center justify-center rounded-lg grid grid-cols-3 h-auto w-fit p-0 divide-X border shrink-0">
                <StatusFilterIcon
                  active={statusFilter === "all"}
                  icon={Layers}
                  label="All"
                  onClick={() => setStatusFilter("all")}
                />
                <StatusFilterIcon
                  active={statusFilter === "published"}
                  icon={CheckCircle}
                  label="Published"
                  onClick={() => setStatusFilter("published")}
                />
                <StatusFilterIcon
                  active={statusFilter === "drafted"}
                  icon={FilePen}
                  label="Drafted"
                  onClick={() => setStatusFilter("drafted")}
                />
              </div>
            )}
          </div>
          {/* TODO INTEGRATE POST SEARCHING */}
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {postsToShow.map((post) => (
                <Link
                  href={`/dashboard/blog/edit/${post.id}`}
                  key={post.id}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{post.title}</span> {/* TODO */}
                    {/*<span className="ml-auto text-xs">Last updated: {post.date}</span>*/}
                  </div>
                  <span className="font-medium">{post.category}</span>
                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                    {post.description}
                  </span>
                </Link>
              ))}
              {postsToShow.length === 0 && (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <SearchX />
                    </EmptyMedia>
                    <EmptyTitle>No posts found</EmptyTitle>
                    <EmptyDescription>
                      No posts match your current filters. Try adjusting them or
                      create a new post.
                    </EmptyDescription>
                  </EmptyHeader>

                  <EmptyContent>
                    <Button asChild>
                      <Link replace href="/dashboard/blog/new">
                        Create Post
                      </Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

const BlogSidebar = (props: ComponentProps<typeof Sidebar>) => {
  const { data, isLoading } = useQuery(usersBlogPostOptions);
  const [activeItem, setActiveItem] = useState<ActiveItem>("published");
  const { setOpen } = useSidebar();
  const posts = useMemo(() => {
    return data ?? [];
  }, [data]);
  const categoriesToShow = useMemo(
    () =>
      BlogCategoryEnumArray.filter((category) =>
        posts.some((post) => post.category === category),
      ),
    [posts],
  );
  const statusesToShow = useMemo(
    () =>
      BlogStatusEnumArray.filter((status) =>
        posts.some((post) => post.status === status),
      ),
    [posts],
  );
  const whatToShow = useMemo(
    () => [...statusesToShow, ...categoriesToShow],
    [categoriesToShow, statusesToShow],
  );
  const listedPosts = useMemo(() => {
    if (activeItem === "published" || activeItem === "drafted") {
      return posts.filter((post) => post.status === activeItem);
    } else {
      return posts.filter((post) => post.category === activeItem);
    }
  }, [activeItem, posts]);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* ICON SIDEBAR */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/dashboard">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <LayoutGrid className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Dashboard</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Go to overview
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: "New",
                      hidden: false,
                    }}
                    onClick={() => {
                      setOpen(false);
                      router.replace("/dashboard/blog/new");
                    }}
                    isActive={pathname === "/dashboard/blog/new"}
                    className="px-2.5 md:px-2"
                  >
                    <Plus />
                    <span>New</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isLoading && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={{
                        children: "Loading your posts..",
                        hidden: false,
                      }}
                      className="px-2.5 md:px-2"
                    >
                      <Spinner />
                      <span>Loading your posts..</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {whatToShow.map((category) => {
                  const Icon = categoryIconMap[category];
                  return (
                    <SidebarMenuItem key={category}>
                      <SidebarMenuButton
                        tooltip={{
                          children: category,
                          hidden: false,
                        }}
                        onClick={() => {
                          setActiveItem(category);
                          setOpen(true);
                        }}
                        isActive={activeItem === category}
                        className="px-2.5 md:px-2"
                      >
                        <Icon />
                        <span>{category}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* TODO USER INFO */}
      </Sidebar>
      {whatToShow.length > 0 && (
        <BlogPostlistSidebar activeItem={activeItem} posts={listedPosts} />
      )}
    </Sidebar>
  );
};

export default BlogSidebar;
