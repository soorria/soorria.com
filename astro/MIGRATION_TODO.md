# Astro Migration - Remaining Tasks

This document outlines what's left to complete the Next.js to Astro migration.

## Current Status

| Category | Status |
|----------|--------|
| Blog Posts | 13/13 (100%) |
| Snippets | 31/35 (89%) |
| Projects | All working |
| Static Pages | All working |
| Homepage | Working |
| RSS/Atom Feeds | Working |
| OG Image Generation | Working |

---

## 1. Excluded Content (4 Snippets)

### 1.1 SolidJS Snippets (2)

**Files:**
- `create-previous-memo` - SolidJS signal history hook
- `use-is-mouse-inactive-solid` - SolidJS mouse inactivity detection

**Issue:** These snippets include interactive SolidJS demos that require SolidJS runtime.

**Fix Options:**
1. **Add SolidJS integration** - Install `@astrojs/solid-js` and configure it alongside React
   ```bash
   npm install @astrojs/solid-js solid-js
   ```
   Then update `astro.config.mjs` to include both React and Solid integrations.

2. **Convert demos to React** - Rewrite the demo components in React (less ideal as the snippets are specifically about SolidJS)

3. **Static rendering only** - Remove interactive demos and just show the code (loses functionality)

**Effort:** Medium (Option 1), High (Option 2), Low (Option 3)

---

### 1.2 Window at Module Level (1)

**File:** `safe-view-transition`

**Issue:** The snippet's `components.tsx` file accesses `window` at the module level:
```ts
const motionSafeMediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
```

This fails during SSR/SSG because `window` doesn't exist on the server.

**Fix Options:**
1. **Lazy initialization** - Wrap the window access in a function or useEffect
2. **Dynamic import** - Use dynamic imports with `client:only="react"`
3. **Conditional check** - Add `typeof window !== 'undefined'` guard

**Effort:** Low - requires modifying `next-16/src/data/snippets/safe-view-transition/components.tsx`

---

### 1.3 JSX in Component Props (1)

**File:** `use-copy-react`

**Issue:** The MDX file passes JSX as a prop to the Collapse component:
```mdx
<Collapse summary={<>
  useCopy implemented with <a href="/snippets/use-temporary-state-react">useTemporaryState</a>
</>}>
```

Astro's MDX processing serializes this JSX incorrectly, resulting in:
```
Error: Objects are not valid as a React child (found: object with keys {astro:jsx, type, props})
```

**Fix Options:**
1. **Change MDX content** - Use a plain string for the summary prop instead of JSX (loses the link)
2. **Use children pattern** - Restructure Collapse to accept summary as a named slot/child
3. **Custom MDX processing** - Implement custom remark/rehype plugin to handle JSX props

**Effort:** Low (Option 1), Medium (Option 2), High (Option 3)

---

## 2. Missing Features

### 2.1 API Routes

**Missing endpoints:**

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `/api/curl-card` | Returns ASCII art business card when curled | Low |
| `/api/snippets` | JSON API for all snippets | Low |
| `/api/snippets/[slug]` | JSON API for single snippet | Low |

**Notes:** These are nice-to-have features. The curl-card is a fun Easter egg for terminal users.

---

### 2.2 Magic Sprinkles Installation

**Missing:** `/installations/magic-sprinkles` - An interactive canvas animation page

**Files needed from Next.js:**
- `src/app/(no-layout)/installations/magic-sprinkles/page.tsx`
- `src/app/(no-layout)/installations/magic-sprinkles/page.client.tsx`
- `src/app/(no-layout)/installations/magic-sprinkles/magic-sprinkles.lazy.tsx`
- `src/app/(no-layout)/installations/magic-sprinkles/magic-sprinkles.lazy-client.tsx`
- `src/components/projects/magic-sprinkles/MagicSprinklesCard.tsx`

**The art page references this:** The "magic sprinkles" entry links to `/installations/magic-sprinkles`

**Effort:** Medium - Requires porting the canvas-based animation and its lazy loading

---

### 2.3 Additional Redirects

**Missing redirects in `vercel.json`:**

```json
{ "source": "/stats", "destination": "https://plausible.mooth.tech/mooth.tech", "permanent": false },
{ "source": "/src", "destination": "https://github.com/soorria/soorria.com", "permanent": false },
{ "source": "/cypress", "destination": "/snippets/cypress", "permanent": false },
{ "source": "/enzyme", "destination": "/snippets/enzyme", "permanent": false },
{ "source": "/diy-promise-all", "destination": "/blog/promise-all", "permanent": false },
{ "source": "/art", "destination": "/authentic-artistique-endevours", "permanent": false }
```

**Effort:** Low - Just add to `vercel.json`

---

### 2.4 Curl-based Business Card

**Feature:** When users `curl soorria.com`, they get an ASCII art business card instead of HTML.

**Implementation needed:**
1. Create `/api/curl-card.ts` endpoint
2. Add rewrite rule for curl user-agent:
   ```json
   {
     "source": "/",
     "destination": "/api/curl-card",
     "has": [{ "type": "header", "key": "user-agent", "value": "curl/(.*)" }]
   }
   ```

**Effort:** Low-Medium - The logic exists in `next-16/src/lib/curl-card.ts`

---

### 2.5 Giscus Comments

**Missing:** Blog posts and snippets don't have comment sections

**Files needed:**
- `src/components/posts/comments/Giscus.tsx`
- `src/components/posts/comments/Giscus.client.tsx`

**Integration points:**
- `src/pages/blog/[slug].astro`
- `src/pages/snippets/[slug].astro`

**Effort:** Low - Giscus is a simple script embed

---

### 2.6 Analytics (Plausible)

**Missing:** Plausible analytics integration

**Next.js uses:** `next-plausible` package with custom domain proxy

**Astro implementation:**
1. Add script tag to layout, or
2. Use `@plausible/analytics` package

**Effort:** Low

---

### 2.7 Sitemap

**Missing:** XML sitemap generation

**Fix:** Install `@astrojs/sitemap`:
```bash
npm install @astrojs/sitemap
```

Then add to `astro.config.mjs`:
```js
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://soorria.com',
  integrations: [sitemap(), ...]
})
```

**Effort:** Very Low

---

### 2.8 Reading Time / Word Count

**Missing:** Blog posts don't show reading time or word count

**Next.js shows:** Reading time and word count in blog post metadata

**Implementation:** Use `reading-time` package with rehype plugin or calculate during build

**Effort:** Low

---

### 2.9 Art Page Images

**Current state:** Art page shows placeholder text instead of actual images

**Required:** Add actual art images to `public/art/` or integrate with image hosting

**Effort:** Depends on image source/availability

---

## 3. Priority Matrix

| Task | Impact | Effort | Priority |
|------|--------|--------|----------|
| Add missing redirects | High | Low | **P1** |
| Add sitemap | High | Very Low | **P1** |
| Add Plausible analytics | High | Low | **P1** |
| Fix `safe-view-transition` | Low | Low | **P2** |
| Add Giscus comments | Medium | Low | **P2** |
| Add reading time | Low | Low | **P2** |
| Fix `use-copy-react` | Low | Low | **P3** |
| Add SolidJS integration | Low | Medium | **P3** |
| Port magic-sprinkles | Low | Medium | **P3** |
| Add curl-card API | Very Low | Medium | **P4** |
| Add snippets JSON API | Very Low | Low | **P4** |
| Add art images | Medium | Varies | **P3** |

---

## 4. Quick Wins (< 30 min each)

1. **Add sitemap integration** - 5 minutes
2. **Add missing redirects to vercel.json** - 10 minutes
3. **Add Plausible analytics script** - 15 minutes
4. **Fix safe-view-transition** - 15 minutes
5. **Add Giscus comments** - 20 minutes

---

## 5. Technical Debt Notes

- Sourcemap warnings during build for `components.tsx` files (non-critical)
- Some MDX component stubs exist but aren't fully implemented (e.g., `TsJsSwitcher`)
- The `mdxComponents` registry has placeholder stubs for some blog-specific components

---

## 6. Testing Checklist

Before considering migration complete:

- [ ] All blog posts render correctly
- [ ] All snippets (except excluded) render correctly
- [ ] Interactive demos work (ReactDemo components)
- [ ] RSS and Atom feeds validate
- [ ] OG images generate correctly
- [ ] Contact form submits successfully
- [ ] All redirects work
- [ ] Links subdomain works
- [ ] Analytics tracking works
- [ ] Comments load (if implemented)
- [ ] Mobile responsive design
- [ ] Dark/light mode (if applicable)
- [ ] Performance metrics acceptable
