# soorria.com Next.js to Astro Migration - Implementation Plan

## Overview

Migrate soorria.com from Next.js 15.5.4 to Astro 5.x, preserving all functionality including MDX content, interactive React components, PartyKit integration, and Vercel deployment features.

## Current State Analysis

### Stack Summary
- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4.0.0 (via @tailwindcss/postcss)
- **Content**: MDX via next-mdx-remote with custom rehype/remark plugins
- **Analytics**: Plausible (proxied via next-plausible)
- **Real-time**: PartyKit for live skills section
- **Deployment**: Vercel with OG image generation, redirects, rewrites

### Key Discoveries

1. **MDX System** (`next-16/src/lib/data.ts:70-144`, `next-16/src/components/mdx/MdxRenderer.tsx:1-37`)
   - Content in `src/data/{blog,snippets,projects}/{slug}/index.mdx`
   - Optional `components.tsx` files for per-post custom components
   - Script generates `data-components.generated.ts` import map
   - Custom remark plugin auto-transpiles TypeScript → JavaScript code blocks

2. **Interactive Components** (identified ~25 client components)
   - WebSocket: `LiveSkillsArea.tsx` (PartyKit)
   - Canvas: `magic-sprinkles.component.tsx`
   - Forms: `Contact.tsx`
   - Filters: `snippet-grid.tsx` with @formkit/auto-animate
   - Code: `TsJsSwitcher.tsx`, `CodeBlockCopyButton.tsx`

3. **ISR Usage** (`next-16/src/app/(main)/page.tsx:17`)
   - Homepage uses `revalidate = 10` for dynamic Supabase content

4. **Next.js-specific Features**
   - Middleware for subdomain routing (`next-16/src/middleware.ts`)
   - `@vercel/og` for OG images (`next-16/src/app/api/og/route.tsx`)
   - Plausible proxy via next-plausible plugin
   - Fontaine for font optimization

## Desired End State

After migration, the site should:
1. Build and deploy on Vercel using Astro with the Vercel adapter
2. Preserve all URLs and redirects (SEO continuity)
3. Render MDX content with identical output
4. Support all interactive React components as Islands
5. Maintain PartyKit integration for live features
6. Generate OG images, RSS/Atom feeds, sitemap
7. Proxy Plausible analytics

### Verification Criteria
- All existing URLs return 200 OK
- Lighthouse scores match or exceed current site
- Interactive features work (code copy, TS/JS toggle, filters, contact form)
- PartyKit live skills section works across clients
- RSS/Atom feeds validate
- OG images generate correctly

## What We're NOT Doing

1. **No Astro 6 Beta** - Stick with Astro 5.x stable for reliability
2. **No major refactoring** - Preserve existing patterns where possible
3. **No content changes** - MDX files remain in same structure
4. **No new features** - Migration only, not enhancement
5. **No dropping PartyKit** - Keep real-time functionality

## Implementation Approach

**Side-by-side migration**: Move existing Next.js code to `next-16/` folder, create fresh Astro project in `astro/` folder. This keeps Next.js runnable as reference while building Astro incrementally.

### Directory Structure (During Migration)

```
soorria.com/
├── next-16/              # Original Next.js code (preserved, runnable)
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React components (reference)
│   │   ├── data/         # MDX content (will symlink to astro)
│   │   ├── lib/          # Utilities (will copy/adapt)
│   │   └── utils/        # Shared utilities
│   ├── public/           # Static assets
│   ├── package.json
│   └── next.config.js
├── astro/                # New Astro project
│   ├── src/
│   │   ├── pages/        # Astro routes
│   │   ├── layouts/      # Astro layouts
│   │   ├── components/   # Ported components
│   │   ├── content/      # Symlink to ../next-16/src/data
│   │   ├── lib/          # Adapted utilities
│   │   └── utils/        # Copied utilities
│   ├── public/           # Symlink to ../next-16/public
│   ├── package.json
│   └── astro.config.mjs
├── thoughts/             # Keep at root
└── partykit.json         # Keep at root
```

---

## Phase 1: Project Scaffolding & Folder Reorganization

### Overview
Move existing Next.js code to `next-16/` folder, initialize fresh Astro project using official CLI, and set up shared resources.

### Changes Required:

#### 1. Move Next.js Code to `next-16/`
**Commands**:
```bash
# Create next-16 folder and move everything except thoughts/
mkdir next-16
git mv src next-16/
git mv public next-16/
git mv package.json next-16/
git mv pnpm-lock.yaml next-16/
git mv next.config.js next-16/
git mv tsconfig.json next-16/
git mv postcss.config.js next-16/
git mv tailwind.config.ts next-16/  # if exists
git mv eslint.config.mts next-16/
git mv prettier.config.mjs next-16/
git mv .husky next-16/
git mv next-env.d.ts next-16/
# Keep partykit.json, thoughts/, .git/, .gitignore at root
```

#### 2. Initialize Astro Project
**Commands**:
```bash
cd /Users/mooth/repos/soorria.com
pnpm create astro@latest astro -- --template minimal --typescript strict --install --git false
```

When prompted:
- Template: `minimal` (we'll configure everything ourselves)
- TypeScript: `strict`
- Install dependencies: Yes
- Initialize git: No (already in git repo)

#### 3. Add Astro Integrations
**Commands** (from `astro/` directory):
```bash
cd astro
pnpm astro add react mdx vercel
pnpm add @tailwindcss/vite tailwindcss
pnpm add rehype-slug rehype-autolink-headings rehype-accessible-emojis rehype-pretty-code rehype-raw remark-gfm
pnpm add gray-matter reading-time feed partysocket @formkit/auto-animate
pnpm add @vercel/og
```

#### 4. Symlink Shared Resources
**Commands**:
```bash
cd astro
# Symlink content directory
ln -s ../next-16/src/data src/content

# Symlink public assets
rm -rf public
ln -s ../next-16/public public

# Symlink fonts specifically if needed
# ln -s ../next-16/public/fonts public/fonts
```

#### 5. Configure Astro
**File**: `astro/astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import { nodeTypes } from '@mdx-js/mdx'

export default defineConfig({
  output: 'static', // Start with static, switch to hybrid for ISR routes
  adapter: vercel(),
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypePrettyCode, {
          theme: 'dracula',
          keepBackground: false,
          tokensMap: { fn: 'entity.name.function' },
          onVisitLine(element) {
            if (element.children.length === 0) {
              element.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(element) {
            element.properties.className?.push('line--highlighted')
          },
        }],
        [rehypeRaw, { passThrough: nodeTypes }],
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          behaviour: 'append',
          properties: { className: 'heading-anchor', ariaHidden: true, tabIndex: -1 },
          content: [],
        }],
        rehypeAccessibleEmojis,
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': '/src',
        '~next': '../next-16/src',  // Reference Next.js code during migration
      },
    },
  },
  redirects: {
    '/stats': 'https://plausible.mooth.tech/mooth.tech',
    '/src': 'https://github.com/soorria/soorria.com',
    '/blogs/[...path]': '/blog/[...path]',
    '/posts/[...path]': '/blog/[...path]',
    '/post/[...path]': '/blog/[...path]',
    '/p/[...path]': '/blog/[...path]',
    '/s/[...path]': '/snippets/[...path]',
    '/snippet/[...path]': '/snippets/[...path]',
    '/cypress': '/snippets/cypress',
    '/enzyme': '/snippets/enzyme',
    '/diy-promise-all': '/blog/promise-all',
    '/art': '/authentic-artistique-endevours',
  },
})
```

#### 6. Configure TypeScript
**File**: `astro/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"],
      "~next/*": ["../next-16/src/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

#### 7. Copy Utility Files
**Files to copy from `next-16/src/` to `astro/src/`**:
- `utils/` directory (most utilities work as-is)
- `lib/supabase.ts` (Supabase client)
- `lib/curl-card.ts` (curl card generation)
- `types/` directory (TypeScript types)

```bash
cp -r next-16/src/utils astro/src/
cp -r next-16/src/types astro/src/
cp next-16/src/lib/supabase.ts astro/src/lib/
cp next-16/src/lib/curl-card.ts astro/src/lib/
```

#### 8. Configure Content Collections
**File**: `astro/src/content.config.ts` (new)

```typescript
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blogCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    private: z.boolean().optional(),
    summary: z.string().optional(),
  }),
})

const snippetsCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/snippets' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    category: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()),
    notMine: z.boolean().optional(),
  }),
})

const projectsCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    stack: z.array(z.string()),
    source: z.string().optional(),
    live: z.string().optional(),
    wip: z.boolean().optional(),
    dead: z.boolean().optional(),
  }),
})

export const collections = {
  blog: blogCollection,
  snippets: snippetsCollection,
  projects: projectsCollection,
}
```

#### 9. Create Test Page
**File**: `astro/src/pages/index.astro` (temporary test)

```astro
---
// Test page to verify setup
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Astro Migration Test</title>
  </head>
  <body>
    <h1>Astro is working!</h1>
    <p>Migration in progress...</p>
  </body>
</html>
```

#### 10. Update Root .gitignore
**File**: `.gitignore` (at repo root)

Add:
```
# Astro
astro/.astro/
astro/dist/
astro/node_modules/

# Next.js (now in next-16/)
next-16/.next/
next-16/node_modules/
```

### Success Criteria:

#### Automated Verification:
- [ ] Next.js still runs from `next-16/`: `cd next-16 && pnpm dev`
- [ ] Astro dev server starts: `cd astro && pnpm dev`
- [ ] Astro build completes: `cd astro && pnpm build`
- [ ] Content symlink works: `ls -la astro/src/content/blog`
- [ ] Public symlink works: `ls -la astro/public/fonts`

#### Manual Verification:
- [ ] http://localhost:3000 shows Next.js site (reference)
- [ ] http://localhost:4321 shows Astro test page
- [ ] Content collections recognized (check `.astro/types.d.ts` generation)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding.

---

## Phase 2: Layouts & Base Components

### Overview
Port layout components and establish the base template structure in the Astro project.

### Changes Required:

#### 1. Copy CSS from Next.js
**Command**:
```bash
cp next-16/src/app/globals.css astro/src/styles/globals.css
```

#### 2. Base Layout
**File**: `astro/src/layouts/Layout.astro` (new)

```astro
---
import '~/styles/globals.css'

interface Props {
  title?: string
  description?: string
  ogImage?: string
}

const {
  title = 'Soorria Saruva',
  description = 'Full Stack Software Engineer',
  ogImage = '/og.png'
} = Astro.props

const canonicalURL = new URL(Astro.url.pathname, Astro.site)
---

<!doctype html>
<html lang="en" class="dark scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />

    <title>{title}</title>
    <meta name="description" content={description} />

    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Font preloads -->
    <link rel="preload" href="/fonts/poppins-regular.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/jetbrains-mono.woff2" as="font" type="font/woff2" crossorigin />

    <!-- Plausible Analytics -->
    <script defer data-domain="soorria.com" src="/js/potato.js"></script>
  </head>
  <body class="min-h-screen bg-drac-base text-drac-content antialiased">
    <slot />
  </body>
</html>
```

#### 3. Main Layout (with Header/Footer)
**File**: `astro/src/layouts/MainLayout.astro` (new)

```astro
---
import Layout from './Layout.astro'
import Header from '~/components/Header'
import Footer from '~/components/Footer'

interface Props {
  title?: string
  description?: string
  ogImage?: string
}

const { title, description, ogImage } = Astro.props
---

<Layout title={title} description={description} ogImage={ogImage}>
  <Header client:load />
  <main role="main" id="main-content" class="grow">
    <slot />
  </main>
  <Footer />
</Layout>
```

#### 4. Port Header Component
**File**: `astro/src/components/Header.tsx` (copy and adapt from `next-16/src/components/Header.tsx`)

Convert to work with Astro routing:
- Replace `usePathname()` with prop-based active detection
- Pass current path as prop from Astro page

```bash
cp next-16/src/components/Header.tsx astro/src/components/
cp next-16/src/components/SpinnyHomeLink.tsx astro/src/components/
cp next-16/src/components/Logo.tsx astro/src/components/
```

#### 5. Port Footer Component
**File**: `astro/src/components/Footer.tsx` (copy from `next-16/src/components/Footer.tsx`)

```bash
cp next-16/src/components/Footer.tsx astro/src/components/
```

Minimal changes needed - mostly static content.

### Success Criteria:

#### Automated Verification:
- [ ] Layouts compile without errors
- [ ] TypeScript passes: `pnpm run typecheck`

#### Manual Verification:
- [ ] Test page with MainLayout renders correctly
- [ ] Header navigation works
- [ ] Footer displays correctly
- [ ] Responsive behavior works

**Implementation Note**: Pause here for manual confirmation before proceeding.

---

## Phase 3: Static Pages

### Overview
Migrate static pages (about, uses, links, contact-success).

### Changes Required:

#### 1. About Page
**File**: `astro/src/pages/about.astro` (new)

```astro
---
import MainLayout from '~/layouts/MainLayout.astro'
import { getEntry } from 'astro:content'
import MdxRenderer from '~/components/mdx/MdxRenderer.astro'

const about = await getEntry('misc', 'about')
---

<MainLayout title="About | Soorria Saruva">
  <article class="prose mx-auto">
    <MdxRenderer code={about.body} />
  </article>
</MainLayout>
```

#### 2. Uses Page
**File**: `astro/src/pages/uses.astro` (new)

Similar structure to about page.

#### 3. Links Page
**File**: `astro/src/pages/links.astro` (new)

```astro
---
import Layout from '~/layouts/Layout.astro'
import { Hero } from '~/components/landing/Hero'
import { links, getLinksHeroOptions } from '~/lib/links'

const heroOptions = await getLinksHeroOptions()
---

<Layout title="Links | Soorria Saruva">
  <Hero pattern={heroOptions.pattern} client:load>
    <h1>{heroOptions.text}</h1>
  </Hero>

  <div class="links-grid">
    {links.map(link => (
      <a href={link.url} class="link-card">
        {link.title}
      </a>
    ))}
  </div>
</Layout>
```

#### 4. Contact Success Page
**File**: `astro/src/pages/contact-success.astro` (new)

Simple thank you page.

### Success Criteria:

#### Automated Verification:
- [ ] All static pages build without errors
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] /about renders correctly
- [ ] /uses renders correctly
- [ ] /links renders correctly
- [ ] /contact-success renders correctly

**Implementation Note**: Pause here for manual confirmation before proceeding.

---

## Phase 4: Content Collections & Dynamic Routes

### Overview
Port blog, snippets, and projects pages using Content Collections.

### Changes Required:

#### 1. Create Astro MDX Renderer
**File**: `astro/src/components/mdx/MdxRenderer.astro` (new)

```astro
---
import { baseComponents } from './base'
import { dataComponents } from './data-components.generated'

interface Props {
  code: string
  type?: 'blog' | 'snippets' | 'projects'
  slug?: string
}

const { code, type, slug } = Astro.props
const key = type && slug ? `${type}/${slug}` : undefined
const componentsForData = key ? dataComponents[key] : {}
const allComponents = { ...baseComponents, ...componentsForData }
---

<Fragment set:html={code} />
```

Note: This needs adjustment - Astro MDX works differently. The actual implementation will use `<Content />` from collection entries.

#### 2. Blog Index Page
**File**: `astro/src/pages/blog/index.astro` (new)

```astro
---
import MainLayout from '~/layouts/MainLayout.astro'
import { getCollection } from 'astro:content'
import BlogPostCard from '~/components/posts/BlogPostCard'

const posts = await getCollection('blog', ({ data }) => !data.private)
const sortedPosts = posts.sort((a, b) =>
  new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime()
)
---

<MainLayout title="Blog | Soorria Saruva">
  <h1>Blog</h1>
  <div class="posts-grid">
    {sortedPosts.map(post => (
      <BlogPostCard post={post} />
    ))}
  </div>
</MainLayout>
```

#### 3. Blog Post Page
**File**: `astro/src/pages/blog/[slug].astro` (new)

```astro
---
import MainLayout from '~/layouts/MainLayout.astro'
import PostLayout from '~/components/posts/PostLayout'
import ProseWrapper from '~/components/posts/ProseWrapper'
import Giscus from '~/components/posts/comments/Giscus'
import { getCollection, getEntry } from 'astro:content'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map(post => ({
    params: { slug: post.id.replace('/index', '') },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await post.render()
---

<MainLayout
  title={`${post.data.title} | Soorria Saruva`}
  description={post.data.shortDescription}
>
  <PostLayout title={post.data.title}>
    <ProseWrapper>
      <Content />
    </ProseWrapper>
    <Giscus dataType="blog" slug={post.id} client:visible />
  </PostLayout>
</MainLayout>
```

#### 4. Snippets Index Page
**File**: `astro/src/pages/snippets/index.astro` (new)

First, copy the SnippetGrid component:
```bash
cp next-16/src/app/\(main\)/snippets/snippet-grid.tsx astro/src/components/snippets/SnippetGrid.tsx
```

```astro
---
import MainLayout from '~/layouts/MainLayout.astro'
import { getCollection } from 'astro:content'
import SnippetGrid from '~/components/snippets/SnippetGrid'

const snippets = await getCollection('snippets')
const sortedSnippets = snippets.sort((a, b) =>
  new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime()
)

// Transform to expected format
const snippetData = sortedSnippets.map(s => ({
  slug: s.id.replace('/index', ''),
  ...s.data,
}))
---

<MainLayout title="Snippets | Soorria Saruva">
  <h1>Snippets</h1>
  <SnippetGrid snippets={snippetData} client:load />
</MainLayout>
```

#### 5. Snippet Page
**File**: `astro/src/pages/snippets/[slug].astro` (new)

Similar structure to blog post page.

#### 6. Projects Index Page
**File**: `astro/src/pages/projects/index.astro` (new)

```astro
---
import MainLayout from '~/layouts/MainLayout.astro'
import { getCollection } from 'astro:content'
import ProjectsGrid from '~/components/projects/ProjectsGrid'

const projects = await getCollection('projects')
// Apply custom ordering from existing projectOrder array
---

<MainLayout title="Projects | Soorria Saruva">
  <h1>Projects</h1>
  <ProjectsGrid projects={projects} />
</MainLayout>
```

#### 7. Project Page
**File**: `astro/src/pages/projects/[slug].astro` (new)

Similar structure to blog post page.

### Success Criteria:

#### Automated Verification:
- [ ] All content pages build without errors
- [ ] `pnpm run build:astro` completes successfully
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] /blog lists all posts correctly
- [ ] /blog/[slug] renders MDX content correctly
- [ ] Code blocks have syntax highlighting
- [ ] TS/JS toggle works in code blocks
- [ ] /snippets lists all snippets
- [ ] /snippets/[slug] renders correctly
- [ ] Snippet filters work
- [ ] /projects lists all projects
- [ ] /projects/[slug] renders correctly

**Implementation Note**: Pause here for manual confirmation before proceeding.

---

## Phase 5: Homepage & Interactive Features

### Overview
Port the homepage with all interactive sections including PartyKit integration.

### Changes Required:

#### 1. Homepage
**File**: `astro/src/pages/index.astro` (replace test page)

```astro
---
import MainLayout from '~/layouts/MainLayout.astro'
import Hero from '~/components/landing/Hero'
import Subtitle from '~/components/landing/Subtitle'
import FeaturedProjects from '~/components/landing/FeaturedProjects'
import SkillsArea from '~/components/landing/SkillsArea'
import Contact from '~/components/landing/Contact'
import { getSingletonTextSafe, getSingletonJsonSafe } from '~/lib/supabase'
import { getCollection } from 'astro:content'

// Fetch dynamic content
const subtitle = await getSingletonTextSafe('subtitle')
const now = await getSingletonTextSafe('now')
const options = await getSingletonJsonSafe('index-options')

// Get featured projects
const projects = await getCollection('projects')
const featuredProjects = projects
  .filter(p => ['prompt-racer', 'not-messenger', 'pokelife'].includes(p.id.replace('/index', '')))
---

<MainLayout>
  <Hero pattern={options.pattern}>
    <h1>Soorria Saruva</h1>
    <Subtitle options={options.subtitles} client:load />
  </Hero>

  <FeaturedProjects projects={featuredProjects} />

  <section>
    <h2>Skills</h2>
    <SkillsArea client:visible />
  </section>

  {now && (
    <section>
      <h2>Now</h2>
      <p set:html={now} />
    </section>
  )}

  <Contact client:visible />
</MainLayout>
```

#### 2. SSR Mode for Homepage (ISR replacement)
**Update**: `astro.config.mjs`

```javascript
export default defineConfig({
  output: 'hybrid', // Changed from 'static'
  adapter: vercel({
    isr: {
      // Enable ISR for specific routes
      expiration: 10,
    },
  }),
  // ... rest of config
})
```

**Update**: `astro/src/pages/index.astro`

```astro
---
export const prerender = false // Enable SSR for this page
// ... rest of component
---
```

#### 3. Copy and Adapt Landing Components
**Commands**:
```bash
cp -r next-16/src/components/landing astro/src/components/
```

Files to adapt:
- `Hero.tsx` - works as-is
- `Subtitle.tsx` - works as-is (client component)
- `FeaturedProjects.tsx` - works as-is
- `SkillsArea.tsx` - works as-is
- `LiveSkillsArea.tsx` - works as-is (uses `usePartySocket`)
- `Contact.tsx` - works as-is (client component)

#### 4. Magic Sprinkles Installation
**File**: `astro/src/pages/installations/magic-sprinkles.astro` (new)

First, copy the Magic Sprinkles components:
```bash
mkdir -p astro/src/components/installations
cp next-16/src/app/\(no-layout\)/installations/magic-sprinkles/*.tsx astro/src/components/installations/
```

```astro
---
import Layout from '~/layouts/Layout.astro'
import MagicSprinklesClient from '~/components/installations/page.client'
import { MagicSprinkles } from '~/components/installations/magic-sprinkles.component'

export const prerender = true
---

<Layout title="Magic Sprinkles">
  <MagicSprinklesClient client:load>
    <MagicSprinkles client:only="react" />
  </MagicSprinklesClient>
</Layout>
```

### Success Criteria:

#### Automated Verification:
- [ ] Homepage builds without errors
- [ ] All interactive components compile
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Homepage renders all sections
- [ ] Hero animation works
- [ ] Subtitle randomizer works
- [ ] Featured projects display correctly
- [ ] Skills area loads and is interactive
- [ ] Live skills sync across browser tabs/devices
- [ ] Contact form submits successfully
- [ ] Magic Sprinkles canvas animation works
- [ ] Fullscreen toggle works

**Implementation Note**: Pause here for manual confirmation before proceeding.

---

## Phase 6: API Routes & Feeds

### Overview
Port API endpoints for OG images, RSS/Atom feeds, and redirects.

### Changes Required:

#### 1. OG Image Endpoint
**File**: `astro/src/pages/api/og.ts` (new)

```typescript
import type { APIRoute } from 'astro'
import { ImageResponse } from '@vercel/og'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') ?? 'Soorria Saruva'
  const subtitle = url.searchParams.get('subtitle')
  const bottomText = url.searchParams.get('bottomText')

  // Load fonts
  const poppinsRegular = await fetch(
    new URL('/fonts/poppins-regular.ttf', request.url)
  ).then(res => res.arrayBuffer())

  const poppinsBold = await fetch(
    new URL('/fonts/poppins-bold.ttf', request.url)
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
        },
        children: [
          // ... same JSX structure as current implementation
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Poppins', data: poppinsRegular, weight: 400 },
        { name: 'PoppinsBold', data: poppinsBold, weight: 700 },
      ],
    }
  )
}
```

#### 2. RSS Feed
**File**: `astro/src/pages/rss.xml.ts` (new)

```typescript
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { Feed } from 'feed'

export const GET: APIRoute = async ({ site }) => {
  const feed = new Feed({
    title: 'Soorria Saruva',
    description: 'Full Stack Software Engineer',
    id: site!.toString(),
    link: site!.toString(),
    language: 'en',
    feedLinks: {
      rss: `${site}rss.xml`,
      atom: `${site}atom.xml`,
    },
    author: {
      name: 'Soorria Saruva',
      email: 'soorria.ss@gmail.com',
    },
  })

  const blog = await getCollection('blog', ({ data }) => !data.private)
  const snippets = await getCollection('snippets')

  const allPosts = [...blog, ...snippets]
    .filter(p => p.data.createdAt)
    .sort((a, b) =>
      new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime()
    )

  for (const post of allPosts) {
    const type = post.collection === 'blog' ? 'blog' : 'snippets'
    const slug = post.id.replace('/index', '')

    feed.addItem({
      title: post.data.title,
      id: `${type}/${slug}`,
      link: `${site}${type}/${slug}`,
      description: post.data.shortDescription,
      date: new Date(post.data.createdAt),
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

#### 3. Atom Feed
**File**: `astro/src/pages/atom.xml.ts` (new)

Same as RSS but returns `feed.atom1()`.

#### 4. Sitemap
**File**: `astro/src/pages/sitemap.xml.ts` (new)

```typescript
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ site }) => {
  const staticPages = [
    '',
    'about',
    'uses',
    'blog',
    'snippets',
    'projects',
    'links',
    'all-posts',
  ]

  const blog = await getCollection('blog')
  const snippets = await getCollection('snippets')
  const projects = await getCollection('projects')

  const urls = [
    ...staticPages.map(page => ({
      url: `${site}${page}`,
      changefreq: 'daily',
      priority: 0.7,
    })),
    ...blog.map(post => ({
      url: `${site}blog/${post.id.replace('/index', '')}`,
      lastmod: post.data.updatedAt || post.data.createdAt,
      changefreq: 'daily',
      priority: 0.7,
    })),
    ...snippets.map(post => ({
      url: `${site}snippets/${post.id.replace('/index', '')}`,
      lastmod: post.data.updatedAt || post.data.createdAt,
      changefreq: 'daily',
      priority: 0.7,
    })),
    ...projects.map(post => ({
      url: `${site}projects/${post.id.replace('/index', '')}`,
      changefreq: 'daily',
      priority: 0.7,
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

#### 5. Curl Card API
**File**: `astro/src/pages/api/_curl-card.ts` (new)

```typescript
import type { APIRoute } from 'astro'
import { getFullMessage } from '~/lib/curl-card'

export const GET: APIRoute = async () => {
  return new Response(getFullMessage())
}
```

### Success Criteria:

#### Automated Verification:
- [ ] All API routes build without errors
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] /api/og?title=Test generates correct image
- [ ] /rss.xml returns valid RSS feed
- [ ] /atom.xml returns valid Atom feed
- [ ] /sitemap.xml returns valid sitemap
- [ ] `curl soorria.com` returns ASCII card

**Implementation Note**: Pause here for manual confirmation before proceeding.

---

## Phase 7: Middleware & Advanced Routing

### Overview
Port middleware for subdomain routing and set up Plausible proxy.

### Changes Required:

#### 1. Astro Middleware
**File**: `astro/src/middleware.ts` (new)

```typescript
import { defineMiddleware } from 'astro:middleware'

const BASE_URL = import.meta.env.PROD ? 'soorria.com' : 'localhost:4321'
const linksPageSubdomains = new Set(['links', 'card', 'cardd', 'carrd'])

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  const host = context.request.headers.get('host')

  // Skip for static files, API routes, etc.
  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/proxy') ||
    pathname.startsWith('/secrets') ||
    !host ||
    !host.includes(`.${BASE_URL}`)
  ) {
    return next()
  }

  const subdomain = host.replace(`.${BASE_URL}`, '')

  if (linksPageSubdomains.has(subdomain)) {
    // Rewrite to links page
    return context.rewrite('/links')
  }

  return next()
})
```

#### 2. Plausible Proxy Setup
**Option A**: Use Vercel rewrites in `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/js/potato.js",
      "destination": "https://plausible.mooth.tech/js/script.js"
    },
    {
      "source": "/api/event",
      "destination": "https://plausible.mooth.tech/api/event"
    }
  ]
}
```

**Option B**: Create proxy API routes

**File**: `astro/src/pages/js/potato.js.ts` (new)

```typescript
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const response = await fetch('https://plausible.mooth.tech/js/script.js')
  return new Response(await response.text(), {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
```

#### 3. Curl Card Rewrite
**File**: `vercel.json` (update)

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/api/_curl-card",
      "has": [
        { "type": "header", "key": "user-agent", "value": "curl/(.*)" }
      ]
    },
    {
      "source": "/",
      "destination": "/api/_curl-card",
      "has": [
        { "type": "header", "key": "user-agent", "value": "HTTPie/(.*)" }
      ]
    }
  ]
}
```

### Success Criteria:

#### Automated Verification:
- [ ] Middleware compiles without errors
- [ ] Build completes successfully

#### Manual Verification:
- [ ] Subdomain routing works (links.soorria.com → /links)
- [ ] Plausible script loads from /js/potato.js
- [ ] Plausible events are tracked
- [ ] `curl localhost:4321` returns ASCII card

**Implementation Note**: Pause here for manual confirmation before proceeding.

---

## Phase 8: Vercel Configuration & Deployment

### Overview
Configure Vercel adapter and prepare for production deployment from the `astro/` directory.

### Changes Required:

#### 1. Vercel Configuration
**File**: `astro/vercel.json` (new)

```json
{
  "buildCommand": "pnpm run build:astro",
  "outputDirectory": "dist",
  "framework": "astro",
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/giscus.css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/rss.xml",
      "destination": "/rss.xml",
      "permanent": true
    },
    {
      "source": "/atom.xml",
      "destination": "/atom.xml",
      "permanent": true
    }
  ]
}
```

#### 2. Environment Variables
Ensure these are set in Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PUBLIC_URL` (https://soorria.com)

#### 3. Update Vercel Project Settings
In Vercel dashboard:
- Root Directory: `astro`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

Or via `vercel.json` in `astro/`:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

#### 4. Test Deployment
Deploy to Vercel preview first, verify everything works before promoting to production.

### Success Criteria:

#### Automated Verification:
- [ ] `pnpm run build:astro` completes successfully
- [ ] Build output size is reasonable
- [ ] No build warnings for missing content

#### Manual Verification:
- [ ] Preview deployment on Vercel works
- [ ] All pages load correctly
- [ ] All interactive features work
- [ ] Analytics tracking works
- [ ] OG images generate correctly
- [ ] RSS/Atom feeds validate
- [ ] Mobile responsive design works
- [ ] Performance (Lighthouse) scores are good

**Implementation Note**: Pause here for manual confirmation before final deployment.

---

## Phase 9: Flatten Structure & Cleanup

### Overview
Once Astro is fully working and deployed, flatten the directory structure by moving Astro to root and removing Next.js code.

### Changes Required:

#### 1. Flatten Astro to Root
**Commands**:
```bash
# Move Astro project contents to root
mv astro/src src
mv astro/public public
mv astro/package.json package.json
mv astro/pnpm-lock.yaml pnpm-lock.yaml
mv astro/astro.config.mjs astro.config.mjs
mv astro/tsconfig.json tsconfig.json
mv astro/vercel.json vercel.json

# Remove empty astro directory
rmdir astro

# Update symlinks (content is now at root)
# Content was symlinked to next-16, now copy it
rm src/content  # remove symlink
mv next-16/src/data src/content  # move actual content

# Remove public symlink and copy
rm public  # remove symlink
mv next-16/public public  # move actual assets
```

#### 2. Remove Next.js Code
**Commands**:
```bash
# Remove the entire next-16 directory
rm -rf next-16
```

#### 3. Update Path Aliases
**File**: `tsconfig.json`

Remove `~next` alias since Next.js code is gone:
```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

#### 4. Update .gitignore
**File**: `.gitignore`

Simplify to:
```
# Astro
.astro/
dist/
node_modules/

# Environment
.env
.env.local
```

#### 5. Verify PartyKit Still Works
Ensure `partykit.json` at root still functions correctly.

### Success Criteria:

#### Automated Verification:
- [ ] Clean install works: `rm -rf node_modules && pnpm install`
- [ ] Build works: `pnpm run build`
- [ ] Lint passes: `pnpm run lint`
- [ ] Types pass: `pnpm run astro check && pnpm run typecheck`
- [ ] PartyKit deploys: `pnpm run deploy:party`

#### Manual Verification:
- [ ] Final review of all pages
- [ ] No broken links
- [ ] All features functional
- [ ] Production deployment successful

---

## Testing Strategy

### Unit Tests
- Content collection schema validation
- Utility function tests (og.ts, data.ts)
- Component render tests for critical components

### Integration Tests
- Full page renders for each route type
- API endpoint responses
- Redirect behavior

### Manual Testing Steps
1. Navigate through all pages via links
2. Test code block copy functionality
3. Test TS/JS toggle across multiple code blocks
4. Test snippet filters with various tag combinations
5. Test contact form submission
6. Verify PartyKit live skills across two browser tabs
7. Test subdomain routing (links.localhost:4321)
8. Verify OG images in social media preview tools
9. Validate RSS/Atom feeds
10. Test mobile responsive behavior
11. Test keyboard navigation and accessibility
12. Run Lighthouse audit

## Performance Considerations

1. **Bundle Size**: Astro should reduce JavaScript bundle significantly due to Islands architecture
2. **Static Generation**: Most pages will be fully static (no client JS by default)
3. **Image Optimization**: Consider @astrojs/image or continue using external image optimization
4. **Font Loading**: Maintain current font preload strategy
5. **Code Splitting**: React components with `client:*` directives will be code-split automatically

## Migration Notes

### Content Changes
- No changes to MDX content files required
- Frontmatter schemas remain compatible
- `components.tsx` files work as-is

### URL Parity
All existing URLs must be preserved:
- `/blog/[slug]` → `/blog/[slug]`
- `/snippets/[slug]` → `/snippets/[slug]`
- `/projects/[slug]` → `/projects/[slug]`
- Static pages unchanged

### Breaking Changes
None expected for end users. Internal changes:
- Build command changes
- Development port changes (3000 → 4321)

## References

- Research document: `thoughts/shared/research/2026-01-31-astro-migration-research.md`
- [Astro Documentation](https://docs.astro.build/)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Vercel Adapter](https://docs.astro.build/en/guides/deploy/vercel/)
