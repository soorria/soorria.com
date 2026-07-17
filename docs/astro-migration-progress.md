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
