# Soorria Saruva's personal website

The source for [soorria.com](https://soorria.com), built with Astro and deployed to
Vercel. Most pages are prerendered; routes backed by Supabase and request-specific
responses run on demand. React and Solid are retained only for interactive islands.

## Development

```sh
pnpm install
pnpm dev
```

## Verification

```sh
pnpm lint
pnpm type-check
pnpm check:astro
pnpm build
pnpm test:migration
pnpm test:interactions
```

The Playwright suites share `playwright.config.ts`. Set `MIGRATION_BASE_URL` to run
them against a deployed URL instead of starting the local Astro development server.

The completed migration's decisions, baseline, and verification record live in
[`docs/astro-migration-plan.md`](docs/astro-migration-plan.md),
[`docs/astro-migration-baseline.md`](docs/astro-migration-baseline.md), and
[`docs/astro-migration-progress.md`](docs/astro-migration-progress.md).
