---
date: 2026-01-31T00:00:00+00:00
researcher: Claude
git_commit: 000000098260974bdb881dc087a6c00307faefdf
branch: astro-3
repository: soorria.com
topic: "Migrating soorria.com from Next.js to Astro"
tags: [research, codebase, astro, next.js, migration]
status: complete
last_updated: 2026-01-31
last_updated_by: Claude
---

# Research: Migrating soorria.com from Next.js to Astro

**Date**: 2026-01-31
**Researcher**: Claude
**Git Commit**: 000000098260974bdb881dc087a6c00307faefdf
**Branch**: astro-3
**Repository**: soorria.com

## Research Question

How to migrate soorria.com from Next.js to the latest version of Astro.

## Summary

The site currently runs on **Next.js 15.5.4** with React 19.2.0, using the App Router architecture. It's a content-driven site with blog posts, code snippets, and project pages served from MDX files. The latest stable Astro version is **5.17.1**, with **Astro 6 Beta** available.

Astro is well-suited for this site because:
1. Content-driven architecture with MDX is a primary Astro use case
2. Most pages are static/pre-rendered (good fit for Astro's default static output)
3. React components can be preserved via Astro Islands
4. Content Collections provide a more elegant solution than the current manual file scanning

## Current Architecture Overview

### Framework Stack
- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4.0.0
- **Content**: MDX via next-mdx-remote
- **Analytics**: Plausible (via next-plausible)
- **Deployment**: Vercel

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Route group with header/footer layout
│   │   ├── blog/[slug]/   # Blog post pages
│   │   ├── snippets/[slug]/ # Code snippet pages
│   │   └── projects/[slug]/ # Project pages
│   ├── (no-layout)/       # Route group without standard layout
│   ├── api/               # API routes
│   └── rss/, atom/        # Feed routes
├── components/            # React components
│   ├── mdx/              # MDX rendering components
│   ├── posts/            # Blog/post components
│   └── landing/          # Homepage components
├── data/                  # MDX content files
│   ├── blog/             # Blog posts
│   ├── snippets/         # Code snippets
│   └── projects/         # Project writeups
├── lib/                   # Server utilities
└── utils/                 # Shared utilities
```

### Content Organization
- **Blog posts**: `src/data/blog/[slug]/index.mdx` + optional `components.tsx`
- **Snippets**: `src/data/snippets/[slug]/index.mdx` + optional `components.tsx`
- **Projects**: `src/data/projects/[slug]/index.mdx` + optional `components.tsx`

### Next.js Features in Use

| Feature | Location | Astro Equivalent |
|---------|----------|------------------|
| App Router file-based routing | `src/app/` | `src/pages/` directory |
| Route groups `(main)`, `(no-layout)` | `src/app/(main)/` | Layouts in `src/layouts/` |
| Dynamic routes `[slug]` | `src/app/(main)/blog/[slug]/` | `src/pages/blog/[slug].astro` |
| `generateStaticParams` | All dynamic routes | `getStaticPaths()` |
| `generateMetadata` | All pages | Frontmatter or `<head>` slot |
| `export const dynamic = 'force-static'` | Blog, snippets, projects | Default behavior (SSG) |
| `export const revalidate = 10` (ISR) | Homepage | SSR adapter or hybrid mode |
| Middleware | `src/middleware.ts` | `src/middleware.ts` or redirects config |
| API routes | `src/app/api/`, `src/pages/api/` | `src/pages/api/` endpoints |
| `next/image` | Throughout | `<Image />` component |
| `next/dynamic` | Lazy loading | `client:*` directives |
| `@vercel/og` ImageResponse | `src/app/api/og/route.tsx` | `@vercel/og` still works on Vercel |
| next-mdx-remote | `src/components/mdx/MdxRenderer.tsx` | Native MDX or Content Collections |

## Astro Version Information

### Latest Stable: Astro 5.17.1

Key features:
- Content Collections with Content Layer API
- Islands Architecture for selective hydration
- Multiple rendering modes (SSG, SSR, hybrid)
- Native MDX support
- TypeScript-first with automatic type generation

### Astro 6 Beta (Released January 13, 2026)

Breaking changes:
- Requires Node 22+
- Removes `Astro.glob()`
- Upgrades to Zod 4

New features:
- Redesigned dev server using Vite's Environment API
- First-class Cloudflare Workers support
- Live Collections (real-time updates)
- Built-in Content Security Policy

**Recommendation**: Start with Astro 5.x stable for migration, upgrade to 6.x later.

## Migration Mapping

### Routing

**Next.js App Router → Astro Pages**

| Next.js | Astro |
|---------|-------|
| `src/app/page.tsx` | `src/pages/index.astro` |
| `src/app/(main)/layout.tsx` | `src/layouts/MainLayout.astro` |
| `src/app/(main)/blog/page.tsx` | `src/pages/blog/index.astro` |
| `src/app/(main)/blog/[slug]/page.tsx` | `src/pages/blog/[slug].astro` |
| `src/app/api/og/route.tsx` | `src/pages/api/og.ts` |

### Content Collections

Replace manual file scanning in `src/lib/data.ts` with Content Collections:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    draft: z.boolean().optional(),
    icon: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  snippets: snippetsCollection,
  projects: projectsCollection,
};
```

### React Components as Islands

Preserve React components with selective hydration:

```astro
---
import Counter from '../components/Counter.jsx';
---

<!-- Static by default -->
<Counter />

<!-- Hydrated when visible -->
<Counter client:visible />

<!-- Hydrated immediately -->
<Counter client:load />
```

### MDX Processing

Current rehype/remark plugins can be reused in `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypePrettyCode,
        rehypeAutolinkHeadings,
      ],
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
```

### ISR Replacement

The homepage uses `revalidate = 10` for ISR. Options in Astro:

1. **Hybrid mode**: Static by default, specific pages rendered on-demand
2. **SSR with caching headers**: Full SSR with CDN caching
3. **Static with rebuild**: Trigger Vercel redeployment when content changes

### Middleware

Current middleware handles subdomain routing. Astro supports middleware:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const host = context.request.headers.get('host');
  // subdomain handling logic
  return next();
});
```

### Integrations Needed

```bash
npx astro add react mdx
npm install @tailwindcss/vite
```

## Files Requiring Migration

### High Priority (Core Functionality)

| Current File | Purpose | Migration Notes |
|--------------|---------|-----------------|
| `next.config.js` | Config | → `astro.config.mjs` |
| `src/app/layout.tsx` | Root layout | → `src/layouts/Layout.astro` |
| `src/lib/data.ts` | Content loading | → Content Collections |
| `src/components/mdx/MdxRenderer.tsx` | MDX rendering | → Native MDX |
| `src/middleware.ts` | Subdomain routing | → Astro middleware |

### Medium Priority (Features)

| Current File | Purpose | Migration Notes |
|--------------|---------|-----------------|
| `src/app/api/og/route.tsx` | OG images | Keep as API endpoint |
| `src/app/rss/route.ts` | RSS feed | → `src/pages/rss.xml.ts` |
| `src/app/sitemap.ts` | Sitemap | → `src/pages/sitemap.xml.ts` |

### Components (Can Preserve as React)

Most React components can be kept and used as Islands:
- `src/components/landing/*` - May need `client:visible` for animations
- `src/components/posts/*` - Mostly static, some interactive
- `src/components/mdx/*` - Static wrappers + interactive demos

## Code References

- Next.js config: `next.config.js:1-218`
- Content loading: `src/lib/data.ts:70-144`
- MDX rendering: `src/components/mdx/MdxRenderer.tsx:1-26`
- Homepage ISR: `src/app/(main)/page.tsx:17`
- Dynamic routes: `src/app/(main)/blog/[slug]/page.tsx:22-28`
- Middleware: `src/middleware.ts:1-31`
- API routes: `src/app/api/og/route.tsx:1-172`

## Open Questions

1. **ISR Strategy**: What's the preferred approach for dynamic homepage content?
   - Hybrid SSR with caching?
   - Static with webhook-triggered rebuilds?
   - Accept slightly stale content?

2. **PartyKit Integration**: The site uses PartyKit (`partykit.json`). How should this integrate with Astro?

3. **Subdomain Routing**: Keep middleware approach or use Vercel edge config?

4. **React 19 Compatibility**: Astro's React integration may need verification with React 19.2.0.

5. **Vercel-specific Features**:
   - `@vercel/og` for OG images
   - Plausible proxy via next-plausible
   - Are there Astro equivalents or do they work directly?

## Migration Steps (High-Level)

1. **Initialize Astro project** alongside existing Next.js
2. **Set up integrations**: React, MDX, Tailwind 4
3. **Migrate content** to Content Collections
4. **Port layouts** to Astro components
5. **Migrate pages** one section at a time (blog → snippets → projects)
6. **Convert React components** to Islands where interactivity needed
7. **Port API routes** for OG images, feeds
8. **Set up middleware** for subdomain routing
9. **Configure Vercel** adapter for deployment
10. **Test and deploy**

## Related Documentation

- [Astro Documentation](https://docs.astro.build/)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Vercel Adapter](https://docs.astro.build/en/guides/deploy/vercel/)
