# Astro migration plan

## Agreed decisions

- Keep hosting on the existing Vercel project and domain.
- Use Astro's default static output with selected on-demand routes.
- Server-render `/` and `/links`, with roughly 10-second CDN caching so Supabase content remains fresh.
- Keep React for interactive islands during the initial migration.
- Keep the existing filesystem/frontmatter content loader.
- Replace `next-mdx-remote` with Astro's MDX compiler; minimal mechanical MDX integration edits are allowed.
- Preserve the current appearance, responsive behaviour, assets, fonts, animations, and accessibility behaviour.
- Use Astro's image component where framework boundaries allow it.
- Preserve `/api/og`, implemented with Satori and Resvg.
- Preserve the curl and HTTPie profile-card response from `/`.
- Remove the unused snippet-data API routes from migration scope.
- Preserve all existing public URLs, redirects, canonical URLs, feeds, sitemap entries, headers, and four links-page subdomains.
- Preserve self-hosted Plausible, its proxy, typed custom events, and opt-out behaviour.
- Leave PartyKit itself out of scope; only smoke-test the website-side connection.
- Add a focused Playwright parity suite.
- Validate through a Vercel Preview before a single in-place production cutover.

## Target architecture

- Astro with static output by default.
- `@astrojs/vercel` for on-demand serverless routes.
- `@astrojs/react` for narrowly hydrated interactive islands.
- `@astrojs/mdx` for content rendering.
- A restricted runtime Markdown/MDX renderer for Supabase-provided homepage strings.
- Existing data loader for discovery, frontmatter, filtering, sorting, reading metrics, and feed data.
- Astro pages and layouts for static presentation.
- Vercel Routing Middleware for host- and user-agent-dependent rewrites.
- Astro-native redirects for ordinary pathname redirects.

Astro pre-renders by default while allowing individual routes to opt into on-demand rendering: <https://docs.astro.build/en/guides/on-demand-rendering/>.

## Phase 1: establish the Next.js baseline

Before changing frameworks:

1. Record every current route, redirect, rewrite, response header, canonical URL, sitemap URL, and feed URL.
2. Capture desktop and mobile screenshots of representative pages.
3. Record rendered metadata for each route type.
4. Exercise current client behaviour, prioritising:
   - MDX React and Solid demos
   - snippet filtering
   - code-copy controls
   - Giscus
   - contact form
   - skills interactions
   - Magic Sprinkles
   - `/secrets`
   - links-page subdomains
5. Save response fixtures for:
   - `/api/og`
   - curl and HTTPie requests to `/`
   - RSS and Atom
   - legacy redirects
6. Add Playwright tests with a configurable base URL.
7. Freeze the Next baseline before changing scripts by using committed screenshots/fixtures plus either a separate Git worktree or the immutable production deployment as the comparison target. Do not depend on running both frameworks from one changing worktree.

## Phase 2: retire the high-risk assumptions with spikes

Complete these vertical spikes before broad route or component migration:

1. Compile and render one ordinary MDX article through Astro while preserving the current remark/rehype output.
2. Migrate one React MDX demo and one Solid MDX demo end to end.
3. Do not pass component constructors, React elements containing component functions, or Solid creator functions through island props; Astro cannot serialize those values.
4. Introduce explicit client entry modules or a stable demo-ID registry so each hydrated island imports its implementation inside the client bundle and receives only serializable props.
5. Render the Supabase-provided `subtitle` and `now` strings through a separate restricted runtime pipeline. Prefer Markdown-to-HTML if the stored content does not require arbitrary MDX; otherwise use `@mdx-js/mdx` on the server with an allowlisted component scope and render the result to static markup.
6. Deploy a minimal Satori/Resvg endpoint to Vercel and verify native-package bundling, local font loading, output size, and cold-start behaviour.
7. Prove Vercel Routing Middleware behaviour for host rewrites, user-agent rewrites, query exclusions, and CDN cache separation before relying on it for cutover.
8. Record the chosen implementations and only then begin the broad migration.

## Phase 3: scaffold Astro around reusable code

Add and configure:

- `astro`
- `@astrojs/react`
- `@astrojs/mdx`
- `@astrojs/vercel`
- `satori`
- `@resvg/resvg-js`
- Playwright
- `prettier-plugin-astro`
- `eslint-plugin-astro`

Configure:

1. Static output by default.
2. The Vercel serverless adapter.
3. React and MDX integrations.
4. Existing `~` and `~data` aliases.
5. Existing PostCSS, Tailwind, nesting, typography, global styles, and prose styles.
   - Update Tailwind source detection so `.astro` and `.mdx` templates are included, rather than retaining the current TS/TSX-only content glob.
6. Existing remark and rehype plugins.
7. `site: 'https://soorria.com'`.
8. Vercel `includeFiles` for content read through `fs` by on-demand functions.
9. `astro dev`, `astro build`, `astro preview`, and `astro check` scripts.
10. Existing PartyKit scripts without modification.
11. Keep explicit `dev:next` and `build:next` scripts until the frozen baseline is no longer needed.
12. Add Astro files to formatting, linting, and TypeScript/editor configuration; remove the Next TypeScript plugin only during cleanup.

The Vercel adapter supports explicitly bundling extra runtime files through `includeFiles`: <https://docs.astro.build/en/guides/integrations-guide/vercel/#includefiles>.

## Phase 4: build the Astro layout and component shell

Create Astro equivalents for:

- Root document and global metadata
- Main layout
- Header and footer
- Containers
- Post and project layouts
- Static landing-page sections
- Error and 404 pages

Convert non-interactive React presentation components to `.astro` where straightforward. Retain interactive components as React islands, applying the narrowest suitable hydration directive:

- `client:load` for immediately interactive controls
- `client:idle` for secondary UI
- `client:visible` for below-the-fold demos and expensive visuals
- `client:only="react"` only where server rendering is genuinely unsafe

Astro hydration directives can also be used in MDX: <https://docs.astro.build/en/reference/directives-reference/>.

Replace:

- `next/link` with ordinary anchors or Astro navigation.
- `next/navigation` with `Astro.url` or browser platform APIs.
- `next/dynamic` with static imports and Astro hydration.
- `next/image` with Astro's image component.
- Next metadata exports with layout props and explicit head markup.

## Phase 5: replace the MDX renderer without replacing the loader

Keep the current loader responsible for:

- Directory discovery
- Frontmatter parsing
- Filtering private and unpublished content
- Sorting
- Reading-time and word counts
- Feed data
- Project and snippet metadata

Replace `next-mdx-remote` with Astro's MDX compiler:

1. Create a compile-time module map for the existing MDX files.
2. Preserve the base component mapping for links, images, notes, code blocks, sandboxes, collapses, sparkles, and TS/JS controls.
3. Preserve the custom TypeScript remark transform.
4. Preserve syntax highlighting, line and word annotations, heading IDs, autolinks, raw HTML, accessible emoji handling, and GFM.
5. Replace the generated `data-components.generated.ts` mechanism with Astro/Vite module discovery.
6. Make mechanical edits to MDX files containing live demos so they render explicit client entry components or stable demo IDs. Hydration directives alone are insufficient because the current `component={Example}` and `create={createExample}` function props are not serializable island props.
7. Keep prose, frontmatter, directories, slugs, and URLs unchanged.
8. Render Supabase-provided homepage strings with the separate restricted runtime renderer established by the spike; Astro's build-time MDX integration cannot compile those request-time strings.
9. Validate all 14 blog posts, 35 snippets, 16 project entries, and two miscellaneous entries.
10. Test the custom plugins against Astro's current MDX/unified dependency versions; preserve output rather than assuming the old plugin and AST types remain source-compatible.

## Phase 6: recreate the route tree

Implement Astro pages for:

- Home
- Blog listing and posts
- Snippet listing and entries
- Project listing and entries
- About
- Uses
- Secrets
- Contact success
- Art
- All posts
- Links
- Magic Sprinkles installation
- Error and 404 pages

Use the retained content loader in `getStaticPaths()` for blog and snippet routes. Project detail pages must preserve the current `hasContent` behaviour: the current 16 empty project bodies resolve to 404 and must not become generated empty pages merely because their frontmatter exists. Unknown slugs must retain the current 404 outcome.

Recreate:

- `robots.txt`
- `sitemap.xml`
- `/rss` and `/rss.xml`
- `/atom` and `/atom.xml`

Generate RSS and Atom at build time using the existing feed helper.

## Phase 7: preserve on-demand routes

Set `prerender = false` for:

- `/`
- `/links`
- `/authentic-artistique-endevours`
- `/api/og`
- Any internal endpoint needed for curl-card routing

For `/`, `/links`, and `/authentic-artistique-endevours`:

1. Retain Supabase reads and safe fallbacks.
2. Bundle required data files into the serverless function.
3. Return `Cache-Control: s-maxage=10, stale-while-revalidate`.
4. Verify Supabase changes appear without a deployment on the two Supabase-backed routes.
5. Preserve the current safe fallback behaviour when Supabase times out. Do not claim last-known-good persistence unless a separate data cache is deliberately added and tested.
6. Preserve the art page's current 10-second regeneration semantics, request-time random tooltip text, and rendered-at timestamp.

Vercel documents this CDN caching approach for Astro SSR: <https://vercel.com/docs/frameworks/frontend/astro#caching>.

## Phase 8: preserve request routing and response headers

Use Vercel Routing Middleware for request-dependent routing:

1. Map `links`, `card`, `cardd`, and `carrd` subdomains to `/links` only under the same predicates as the current middleware.
2. Preserve the current subdomain exclusions for dotted asset paths, `/api`, `/proxy`, and `/secrets`.
3. Detect `curl/*` and `HTTPie/*` user agents requesting `/`.
4. Preserve the current `card` query-parameter exclusion: requests containing that query key stay on the HTML homepage.
5. Rewrite eligible command-line requests to the plain-text curl-card endpoint.
6. Leave ordinary browser requests on the server-rendered homepage.
7. Verify that a command-line response and browser response cannot poison one another's CDN cache entries.

Use Astro-native redirects for ordinary pathname redirects:

- `/blogs/*`
- `/posts/*`
- `/post/*`
- `/p/*`
- `/s/*`
- `/snippet/*`
- `/cypress`
- `/enzyme`
- `/diy-promise-all`
- `/art`
- `/installations`
- `/contact`
- `/src`
- `/stats`

Preserve the cache and CORS headers for fonts and `giscus.css`.

Current Vercel guidance says conditional rewrites for Astro projects should use Vercel Routing Middleware: <https://vercel.com/docs/frameworks/frontend/astro#rewrites>.

## Phase 9: reimplement dynamic OG images

Preserve the `/api/og` query contract:

- `title`
- repeated `titleParts`
- `subtitle`
- `bottomText`
- `debug`

Implementation:

1. Load the existing Poppins fonts locally.
2. Render the existing card layout to SVG with Satori.
3. Convert the SVG to a 1200x630 PNG with Resvg.
4. Return the correct content type and cache headers.
5. Preserve `/og.png` as the default-site-card alias.
6. Compare generated images with current endpoint fixtures.

References: <https://github.com/vercel/satori> and <https://github.com/thx/resvg-js>.

## Phase 10: migrate images

1. Inventory images by boundary before conversion: Astro-rendered imports, retained React-island imports, MDX public-path strings, GIFs, and remote/dynamic images.
2. Use Astro's image component for importable local images rendered by Astro components.
3. Move assets into importable source locations or create typed image registries where optimisation requires build-time metadata.
4. Preserve dimensions, aspect ratios, alt text, responsive sizes, lazy loading, and layout.
5. Use ordinary `<img>` elements inside retained React islands and for public-path strings where Astro image metadata cannot cross the boundary cleanly.
6. Remove each `next/image` import only after its replacement path is proven.
7. Preserve GIF behaviour and intentionally unoptimised images.
8. Verify there is no cumulative layout-shift regression.

## Phase 11: replace the Next-specific Plausible integration

Remove `next-plausible` and add:

1. The self-hosted Plausible script to the Astro root layout.
2. Vercel proxy routing for the `potato` script and event endpoint.
3. A small typed browser tracking module.
4. A compatible React hook wrapper for existing islands.

Preserve:

- `Easter Egg`
- `Links Page`
- `Play with skills`
- `Clicked code block copy button`
- Development logging
- Track-first-event behaviour
- `plausible_ignore` and the `/secrets` opt-out UI
- `/stats`

## Phase 12: remove Next.js after parity

Once Astro owns all routes:

1. Delete the old Next route tree after reusable code has moved.
2. Delete the obsolete snippet-data APIs.
3. Remove `next`, `next-mdx-remote`, `next-plausible`, `@next/bundle-analyzer`, and `@next/eslint-plugin-next`.
4. Remove `next.config.js`, `next-env.d.ts`, and Next-specific types.
5. Remove obsolete MDX code generation.
6. Tighten TypeScript so build errors are no longer ignored.
7. Keep PartyKit source, configuration, dependencies, and deployment scripts intact.
8. Avoid unrelated refactors during this phase.

## Phase 13: verification and cutover

Run:

- Formatting
- ESLint
- `astro check`
- Production build
- Playwright suite
- Broken-link crawl
- Metadata validation
- Sitemap, RSS, Atom, and robots validation
- OG image snapshot comparison
- Mobile and desktop screenshot comparison
- JavaScript-disabled checks
- Supabase cache-expiry and failure tests
- Host-header and user-agent routing tests
- `card` query exclusion tests for both curl and HTTPie
- Subdomain exclusion tests for assets, API paths, proxy paths, and `/secrets`
- Analytics request tests
- PartySocket connection smoke test

Deploy the branch as a Vercel Preview, compare it against production route by route, then merge for an in-place cutover using the existing Vercel project and domain.

## Acceptance gates

The migration is ready to cut over only when:

1. Every retained public URL returns the expected status, content type, and redirect destination.
2. Visual comparisons show no unintended desktop or mobile regressions.
3. Every MDX entry builds, runtime Supabase content renders safely, and all embedded demos behave as before without function-valued island props.
4. The homepage and links page reflect Supabase changes through the CDN cache window.
5. The four links-page subdomains and curl/HTTPie routing—including all current exclusions—work on a Vercel Preview or equivalent production-like environment without cache-key contamination.
6. OG images, feeds, sitemap, robots, canonical tags, Open Graph tags, and Twitter tags match their existing contracts.
7. Plausible events and opt-out behaviour are verified without double-counting.
8. The production build contains no Next.js runtime dependency.
9. PartyKit deployment configuration is unchanged and the website-side client still connects.
10. Empty project bodies still return 404 rather than becoming generated placeholder pages.
11. The art page retains its request-time variability and roughly 10-second cache behaviour.

## Highest-risk seams

1. MDX compilation and selectively hydrating embedded demos.
2. Conditional host and user-agent rewrites on Vercel.
3. Reproducing dynamic OG images and font rendering.
4. Replacing `next/image` without layout changes.
5. Removing Next-specific assumptions from retained React islands.
6. Bundling filesystem-loaded data into on-demand serverless functions.
7. Rendering request-time Supabase content without reintroducing a whole-page React application.
8. Preserving empty-project 404 behaviour while changing dynamic-route generation.

## Adversarial review record

An adversarial subagent review identified and corrected these assumptions:

1. Astro build-time MDX does not solve runtime Supabase strings.
2. Existing React and Solid demo functions cannot cross serialized island props.
3. Generating every project slug would change the current all-empty-project 404 behaviour.
4. Curl routing was missing the `card` query exclusion, and host rewrites were missing pathname exclusions.
5. The art page was incorrectly treated as static despite its current revalidation, randomness, and timestamp.
6. The plan promised last-known-good Supabase behaviour that the current safe loaders do not provide.
7. The image plan did not distinguish importable Astro assets from React-island and public-path images.
8. Dual-framework parity testing needed an immutable baseline rather than an assumption that both frameworks could share one changing worktree.

The review agreed that static-by-default Astro with selective on-demand routes is a good fit, and that keeping PartyKit out of scope while requiring production-like Vercel verification correctly isolates deployment risk.
