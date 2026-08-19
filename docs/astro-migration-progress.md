# Astro migration progress

## 2026-07-18: baseline and feasibility spikes

Work is isolated in `/Users/mooth/repos/soorria.com-astro` on `codex/astro-migration`.

### Completed

- Added the reviewed migration plan to the migration branch.
- Added a configurable Playwright baseline with 54 passing Next.js route contracts.
- Recorded the existing `/blog/promise-all` local image failure as a defect, not a parity target.
- Added Astro 7, React, MDX, Vercel, Tailwind/Vite, Satori, Resvg, and Playwright scaffolding while retaining the Next scripts.
- Upgraded `tsx`, `esbuild`, and `unified` to versions compatible with Astro 7/Vite 8; the existing Next type-check and MDX codegen still pass.
- Proved that an existing repository MDX file compiles with the custom remark/rehype pipeline.
- Proved a serializable demo-ID boundary for both React and Solid demos. Component constructors and creator functions stay inside the client entry module rather than crossing Astro island props.
- Added a restricted request-time Markdown renderer for Supabase strings. It supports Markdown/GFM but does not evaluate raw HTML, imports, MDX expressions, or JavaScript.
- Proved Satori plus Resvg can render a PNG with a local Poppins font and bundle into the Vercel adapter's server output.
- Added five passing browser tests for the Astro risk spikes.

### Findings that affect implementation

- Use `@tailwindcss/vite`; the existing PostCSS path did not resolve `@import 'tailwindcss'` under Vite 8/Rolldown.
- Configure the existing remark/rehype plugins through `@astrojs/markdown-remark`'s `unified()` processor. Passing them directly to the MDX integration is deprecated in Astro 7.
- Vercel adapter `includeFiles` accepts concrete paths/directories, not a glob such as `src/data/**/*.mdx`. Including `src/data` builds successfully.
- The Vercel adapter does not support `astro preview`. Local interaction tests use `astro dev`; serverless parity needs `vercel dev` or a Vercel Preview.
- Astro 7 detects agent environments and backgrounds its dev server automatically. Playwright sets `ASTRO_DEV_BACKGROUND=0` so its web-server lifecycle remains foreground and deterministic.
- The latest Astro ESLint plugin requires ESLint 10. Astro-specific ESLint integration is deferred until Next cleanup to avoid destabilising the frozen baseline; `astro check` covers the new files meanwhile.

### Verification

- `pnpm type-check`
- `pnpm check:astro` — zero errors (existing repository hints remain)
- `pnpm build:astro`
- `pnpm test:astro-spikes` — 5 passed
- `pnpm test:migration` — 54 passed

### Next implementation slice

1. Promote the spike-only Astro directory into the real Astro layout and page shell.
2. Move static global metadata, fonts, styles, header, footer, and shared layouts.
3. Add compile-time MDX lookup and migrate one complete content route before expanding to all posts and snippets.
4. Replace the spike OG route with the compatible `/api/og` contract.
5. Implement the first server-rendered Supabase route after the layout is stable.

## 2026-07-18: first real Astro content route

### Completed

- Added Astro-native base, main, and post layouts with the existing global/prose styles, font preloads, metadata defaults, no-JS overrides, Plausible script contract, header, footer, and container shell.
- Added a typed compile-time content module registry and migrated `/blog/event-delegation` as the first real static content route.
- Preserved the route's current `/posts/event-delegation` canonical URL, article metadata, reading metrics, date display, heading anchors, syntax highlighting, and sandbox embed.
- Added Astro MDX components for links, notes, code blocks, generated TypeScript/JavaScript switchers, sandboxes, sparkles, and serializable-ID demo islands.
- Updated the shared MDX source to use `<MdxDemo id="event-delegation">` and registered that ID in both the Astro and still-runnable Next renderers.
- Kept Giscus behind `client:only="react"`; its current component reads `location` during render and therefore cannot participate in Astro's prerender SSR pass.
- Added four browser tests for the real route, covering shell/metadata/content, demo hydration, TS/JS switching, and the comments client-only boundary.
- Added Astro/test formatting to the repository formatter and commit hook while retaining `astro check` as the Astro lint/type gate.

### Findings that affect implementation

- `client:visible` still server-renders a React island during prerender. Browser-global components such as the current Giscus implementation require `client:only="react"` until they are made SSR-safe.
- The custom TypeScript remark transform injects `TsJsSwitcher` even when the source MDX does not name it. Every Astro MDX component map must provide that generated component.
- The existing Plausible `/potato` script proxy is not available under `astro dev`; verify it with `vercel dev` or a Vercel Preview when routing middleware is introduced.
- Prettier 3 requires the Astro and Tailwind plugins to be named in the shared config; installing them alone does not make `.astro` parser inference reliable.

### Verification

- `pnpm type-check`
- `pnpm check:astro` — zero errors (existing repository hints remain)
- `pnpm build:astro`
- `pnpm test:astro-spikes` — 9 passed
- `pnpm test:migration` — 54 passed
- `pnpm peers check`
- Manual desktop browser check of layout, metadata, demo hydration, TS/JS switching, Giscus loading, and console errors.

### Next implementation slice

1. Expand the compile-time registry and MDX component coverage across the remaining blog posts and snippets.
2. Replace the spike OG route with the compatible `/api/og` query contract.
3. Implement the first server-rendered Supabase route after the static content pipeline is stable.
4. Add Vercel Routing Middleware and validate the Plausible proxy, host rewrites, and curl/HTTPie behavior with `vercel dev` or a Preview deployment.

## 2026-07-18: migration completed

### Completed

- Migrated all 14 blog posts, 35 snippets, 16 project records, and two miscellaneous MDX entries to Astro's compile-time content pipeline.
- Recreated the complete public route tree, feeds, sitemap, robots policy, legacy redirects, OG endpoint, curl card, host rewrites, cache headers, and Plausible proxy contract.
- Preserved the React and Solid demos through serializable IDs, the bespoke project cards, Magic Sprinkles, the analytics opt-out control, Giscus, and the PartySocket-powered skills area.
- Preserved request-time Supabase content and safe fallbacks on the home and links pages, plus the art page's 10-second cache policy, render timestamp, and random NFT tooltip meanings.
- Removed the Next route tree, Next configuration, snippet APIs, MDX code generator, and all Next-specific runtime and lint dependencies.
- Changed the default development and production commands to Astro and changed the existing Vercel project's framework preset from Next.js to Astro.
- Removed the temporary public spike routes; the feasibility coverage now runs against real production routes.

### Verification

- `pnpm lint`
- `pnpm type-check`
- `pnpm check:astro` — zero errors
- `pnpm build`
- `pnpm test:migration` — 110 passed, covering every blog/snippet route and the retained public contracts
- `pnpm test:interactions` — 9 passed, covering React/Solid hydration, MDX transforms, runtime Markdown, comments, and OG rendering

## 2026-08-18: Vercel Preview parity audit

### Completed

- Validated PR #14 against its Vercel Preview and compared representative desktop
  and mobile pages with `soorria.com`.
- Passed 111 deployed route, metadata, redirect, feed, image, no-JavaScript, and
  interaction checks. The foreign-host-header case is intentionally skipped on
  Vercel Preview because preview deployments reject a custom `Host` header; the
  same middleware contract remains covered locally.
- Confirmed all seven art images load on the preview.
- Confirmed the public image in `/blog/partyify-anyone` loads and decodes at
  1027×581. The corresponding production Next.js optimizer request returned HTTP
  400, so the Astro result fixes a known class of baseline image defect.
- Verified the Plausible proxy markup, request-time art variability, PartySocket
  connection, and the curl/HTTPie response contracts on the preview.

### Current state

The migration implementation and preview cutover gates are complete. The two
Playwright suites remain as regression coverage and share the root
`playwright.config.ts`; `MIGRATION_BASE_URL` targets an external deployment.
