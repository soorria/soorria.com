# Astro migration baseline

This document records observations made while establishing the now-retired Next.js
baseline. It is retained as migration history, not as current operating guidance or
a request to preserve known defects.

## Harness

- `playwright.config.ts` now starts the Astro app and serves both contract and
  interaction suites.
- Set `MIGRATION_BASE_URL` to run the contracts against a deployed URL without
  starting a local server.
- `tests/migration/contracts.ts` is the initial route, redirect, and empty-project contract inventory.
- `tests/migration/route-contracts.spec.ts` covers HTML routes, feeds, redirects, sitemap/robots, OG images, empty project 404s, and curl/HTTPie behaviour.

## Known baseline issue: local MDX images

On 2026-07-18, the local Next.js baseline returned HTTP 500 for `/blog/promise-all` because `next/image` rejected `/img/promise-all/promise-all.png`. The configured `images.localPatterns` only permits `/api/og`, so public MDX image paths do not match.

The Astro implementation makes public MDX image handling explicit and does not
reproduce this defect. Preview verification also confirmed that the image on
`/blog/partyify-anyone` decodes at 1027×581; its production Next.js optimizer URL
returned HTTP 400 during the 2026-08-18 parity audit.

## Baseline runner concurrency

The old Next development server intermittently returned a truncated JSON/RSC
response from `/` when Playwright forced several cold route compilations in
parallel. The suites remain serial so dynamic-route requests and failures are easy
to attribute; this is no longer a Next.js runtime workaround.

## Astro/Vercel local preview

The Vercel adapter does not implement `astro preview`. Local browser tests use
`astro dev`, deployable output is verified with `astro build`, and serverless/runtime
behaviour is checked against a Vercel Preview by setting `MIGRATION_BASE_URL`.
