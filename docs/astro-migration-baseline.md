# Astro migration baseline

This document records observations made while establishing the executable Next.js baseline. It is not a request to preserve known defects.

## Harness

- `playwright.config.ts` starts the current Next.js app by default.
- Set `MIGRATION_BASE_URL` to run the same contracts against an immutable deployment or the future Astro preview.
- `tests/migration/contracts.ts` is the initial route, redirect, and empty-project contract inventory.
- `tests/migration/route-contracts.spec.ts` covers HTML routes, feeds, redirects, sitemap/robots, OG images, empty project 404s, and curl/HTTPie behaviour.

## Known baseline issue: local MDX images

On 2026-07-18, the local Next.js baseline returned HTTP 500 for `/blog/promise-all` because `next/image` rejected `/img/promise-all/promise-all.png`. The configured `images.localPatterns` only permits `/api/og`, so public MDX image paths do not match.

The Astro migration should make image handling explicit and return HTTP 200 for published posts; it should not reproduce this defect. A working interactive post (`/blog/event-delegation`) is used as the initial smoke route while complete content validation is added during the MDX migration.

## Baseline runner concurrency

The current Next development server intermittently returned a truncated JSON/RSC response from `/` when Playwright forced several cold route compilations in parallel. The initial contract file therefore runs serially. Astro preview testing can add a separate load/concurrency check once route parity is established.

## Astro/Vercel local preview

The Vercel adapter does not implement `astro preview`. Local Astro interaction tests use `astro dev`; deployable output is verified with `astro build`, and serverless/runtime parity must be tested on a Vercel Preview (or with `vercel dev`) before cutover.
