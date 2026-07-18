import type { APIRoute } from 'astro'
import { createFeed } from '~/lib/data'
export const GET: APIRoute = async () =>
  new Response((await createFeed()).atom1(), {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
