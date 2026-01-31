import type { APIRoute } from 'astro'
import { getFullMessage } from '~/lib/curl-card'

export const prerender = false

export const GET: APIRoute = () => {
  return new Response(getFullMessage(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
