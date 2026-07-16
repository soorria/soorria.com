import type { APIRoute } from 'astro'
import { createFeed } from '~/lib/feed'

export const prerender = true

export const GET: APIRoute = async () => {
  const feed = await createFeed()
  return new Response(feed.atom1(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
