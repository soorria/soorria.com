import type { APIRoute } from 'astro'
import { createFeed } from '../../src/lib/data'
export const GET: APIRoute = async () =>
  new Response((await createFeed()).atom1(), {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
