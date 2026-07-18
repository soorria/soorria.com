import type { APIRoute } from 'astro'
import { createFeed } from '~/lib/data'
export const GET: APIRoute = async () =>
  new Response((await createFeed()).rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
