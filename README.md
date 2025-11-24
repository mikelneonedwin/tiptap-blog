# Tiptap Blog - Modern Blog Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-blue?style=flat\&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat\&logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-00D1B2?style=flat\&logo=prisma)](https://prisma.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-3B82F6?style=flat\&logo=tailwind)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn--ui-EA580C?style=flat\&logo=shadcn)](https://ui.shadcn.com)

A full-stack blog platform built with **Next.js 16 App Router**, **Prisma + PostgreSQL**, **Better Auth** (email/password + GitHub OAuth), **Tiptap v3 rich text editor**, **TanStack Query** (RSC hydration), **Cloudinary**, **Zod**, **TailwindCSS v4** (OKLCH theme), and **shadcn/ui** components.

---

## TL;DR for Developers

1. **Clone & install**:

```bash
pnpm i
pnpm prisma generate
pnpm prisma db push
pnpm dev
```

2. **Environment variables**: see `lib/env.ts`. Required: Postgres, Better Auth, GitHub OAuth, Cloudinary.

3. **Key folders**:

* `features/blog/` → blog logic, server actions, editor providers.
* `features/auth/` → auth mutations, utils, pages.
* `prisma/` → schema + generators.
* `lib/` → utilities, Cloudinary, Prisma client, auth.
* `app/` → App Router pages & layouts.
* `components/` → shadcn/ui + custom UI components.

4. **Critical files for onboarding**:

* `features/blog/actions.ts` → CRUD & server actions.
* `features/blog/providers/EditorProvider.tsx` → Editor context.
* `prisma/schema.prisma` → DB models and enums.

5. **Run & preview**: Navigate to `/dashboard/blog/new` to create a post, or `/blog` to view public posts.

---

## 🚀 Features

* **Authentication**: Email/password + GitHub OAuth, session-based with Better Auth.
* **Rich Text Editor**: Tiptap v3 with StarterKit + extensions (color, highlight, image, link, table, task list, details, YouTube, text-align).

  * Paste Markdown detection & parsing.
  * Custom `LinkButton` node.
  * Dual-pane editor/preview with metadata sidebar.
  * Image cropper (16:9) + Cloudinary upload.
* **Blog Management**: Create/Edit posts with slug auto-generation, description, category, tags, status, cover image. Dashboard with collapsible icon sidebar + dynamic post list. Optimistic updates via TanStack Query.
* **Public Blog**: Infinite scroll (12 posts/page), category filters, SEO-optimized single post pages with author info & share button.
* **UI/UX**: Responsive, theme-aware, dual sidebars, mobile editor ribbon, loading/skeleton states, error boundaries, toasts (Sonner).
* **Performance**: RSC prefetching, query hydration, Next/Image + Cloudinary optimization, revalidation on publish/update/delete.
* **Data Layer**: Prisma with custom Zod generators and enum arrays. Server Actions for CRUD with authorization.

---

## 🏗 Architecture & Codebase Overview

```
tiptap-blog/
├── prisma/
│   ├── schema.prisma           # DB models & enums
│   ├── zod-generator.config.json
│   └── generators/enum-array.ts
├── generated/                  # Auto-generated (gitignored)
│   ├── prisma/client/
│   ├── zod/schemas.ts
│   └── enums.ts
├── lib/
│   ├── auth.ts                 # Better Auth instance
│   ├── prisma.ts               # Prisma client singleton
│   ├── cloudinary.ts
│   ├── env.ts
│   ├── utils.ts
│   └── seo.ts
├── features/
│   ├── auth/                   # Auth logic
│   └── blog/                   # Blog logic
│       ├── actions.ts          # Server Actions
│       ├── schemas.ts          # Zod schemas
│       ├── mutations.ts        # TanStack Query mutations
│       ├── query-options.ts
│       ├── providers/          # EditorProvider, PostToEditProvider
│       ├── components/         # Editor ribbons, sidebars, dropzone, cropper
│       ├── layouts/            # Dashboard & Public layouts
│       └── pages/              # RSC pages
├── components/                 # shadcn/ui + custom
├── app/                        # App Router
│   ├── (auth)/                 # Login/Signup
│   ├── dashboard/blog/         # Editor layouts
│   ├── blog/                   # Public blog
│   ├── api/auth/[...all]/route.ts
│   ├── providers.tsx
│   └── layout.tsx
└── package.json
```

> Optional: Add a diagram showing **editor → server actions → Prisma → dashboard → public blog**.

---

### Database Schema (Prisma)

```prisma
model User { ... }
model Session { ... }
model Account { ... }
model Verification { ... }

enum BlogStatus { published, drafted }
enum BlogCategory { Company, Product, Tutorial, ... }

model Blog {
  id          String       @id @default(uuid())
  title       String
  slug        String       @unique
  description String
  category    BlogCategory
  authorId    String
  content     String
  tags        Json?        // string[]
  coverImage  String
  status      BlogStatus
  author      User         @relation(fields: [authorId], references: [id])
}
```

---

### Authentication (Better Auth)

* Setup via `lib/auth.ts` with Prisma adapter.
* Client: `lib/auth-client.ts` → `useSession`, `signIn`, `signUp`.
* Server utils: `features/auth/utils.ts` → `getSession()`, `authorizeSession()`.
* Auth pages in `(auth)/login|signup` guard access.
* Token-based sessions with IP/userAgent tracking.

---

### Blog CRUD Flow

1. **Dashboard** `/dashboard/blog`

   * Layout: `DashboardBlogLayout.tsx`
   * Sidebar: icon panel + list panel with filters
   * Post list via `usersBlogPostOptions` query

2. **Create Post** `/dashboard/blog/new`

   * EditorProvider + RHForm + Tiptap extensions
   * Sidebar: Controls + Metadata (status, title→slug, desc, category, tags, cover image)
   * Mutation: `useCreateBlogPostMutation` → `publishBlogPost()`

3. **Edit Post** `/dashboard/blog/edit/[postId]`

   * PostToUpdateProvider → `getBlogPostForEdits()`
   * Partial updates & path revalidation

4. **Public Blog** `/blog` & `/blog/post/[slug]`

   * Infinite scroll with cursor-based pagination
   * Prefetch queries in layouts
   * Single post page → BlogViewer component

---

### Editor (Tiptap v3)

* Extensions: StarterKit + Markdown paste + custom `LinkButton`
* Hooks: `useEditorContext()`, `useEditorState()`
* Ribbons: Undo/redo, formatting, color dialogs, alignment, actions
* Mobile: FAB dropdown → popover ribbons
* Styles: `globals.css` → headings, tables, lists, code, buttons

---

### Setup & Running

```bash
# Install dependencies
pnpm i
pnpm prisma generate
pnpm prisma db push

# Run dev server
pnpm dev
```

**Environment Variables (`lib/env.ts`)**:

```
POSTGRES_PRISMA_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
GITHUB_CLIENT_ID/SECRET
CLOUDINARY_CLOUD_NAME/API_KEY/SECRET
```

**Scripts**

* `dev` → Next dev
* `build` → Prisma generate + Next build
* `lint` → TSC + ESLint fix
* `prepare` → Husky hooks

---

### Deployment (Vercel)

* Edge-ready with Next 16 + ESM
* Trusted deps: Prisma, esbuild, sharp, unrs-resolver
* Database: Neon/Supabase
* Sitemap auto-revalidated

---

### Known Issues / TODO

* Error handling in actions
* Search sidebar input stub
* Dynamic categories in navbar
* Bio length validations
* Add shadcn instructions

---

### Future Enhancements

* Comments & analytics
* RSS feed
* Full-text search (pg_trgm)
* AI-generated content
