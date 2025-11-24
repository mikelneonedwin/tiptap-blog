"use client";

import { ModeToggle } from "@/components/mode-toggle";
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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
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
import { useDeleteBlogPostMutation } from "../../mutations";
import { usersBlogPostOptions } from "../../query-options";
import type { ListedPost } from "../../types";
import { getEditBlogPostUrl } from "../../client-utils";

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
        <Button
          onClick={onClick}
          data-state={active ? "active" : "inactive"}
          variant={active ? "default" : "outline"}
          className="data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
        >
          <Icon className="size-5" />
        </Button>
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
  const [search, setSearch] = useState("");
  const postsToShow = useMemo(() => {
    let out = posts;

    if (statusFilter !== "all") {
      out = out.filter((post) => post.status === statusFilter);
    }

    if (search) {
      out = out.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return out;
  }, [posts, statusFilter, search]);

  const pathname = usePathname();
  const deletePostMutation = useDeleteBlogPostMutation();
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
              <div className="bg-muted text-muted-foreground items-center justify-center rounded-lg grid grid-cols-3 gap-1 h-auto w-fit p-0 divide-X border shrink-0">
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
          <SidebarInput
            placeholder="Type to search..."
            onChange={(e) => {
              setSearch(e.currentTarget.value);
            }}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {postsToShow.map((post) => {
                const href = getEditBlogPostUrl(post.id);
                const active = pathname === href;
                const isDeleting = post.id === deletePostMutation.variables;
                return (
                  <Link
                    href={active ? "#" : href}
                    key={post.id}
                    className={cn(
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2.5 border-b p-4 text-sm leading-tight last:border-b-0 w-full",
                      active &&
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                      isDeleting &&
                        "opacity-50 pointer-events-none bg-red-50 dark:bg-red-950/20",
                    )}
                  >
                    <span className="line-clamp-1">{post.title}</span>
                    <span className="font-medium capitalize">
                      {post.category} • {post.status}
                    </span>
                    <span className="line-clamp-2 text-xs whitespace-break-spaces">
                      {post.description}
                    </span>
                  </Link>
                );
              })}
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
                      if (pathname === "/dashboard/blog/new") return;
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
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={{
                  children: "Toggle Theme",
                  hidden: false,
                }}
                className="px-2.5 md:px-2"
              >
                <ModeToggle />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                disabled={!whatToShow.length}
                tooltip={{
                  children: "Toggle Sidebar",
                  hidden: false,
                }}
                className="px-2.5 md:px-2"
              >
                <SidebarTrigger disabled={!whatToShow.length} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        {/* TODO USER INFO */}
      </Sidebar>
      {whatToShow.length > 0 && (
        <BlogPostlistSidebar activeItem={activeItem} posts={listedPosts} />
      )}
    </Sidebar>
  );
};

export default BlogSidebar;
