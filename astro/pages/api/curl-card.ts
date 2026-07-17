import type { APIRoute } from 'astro'
import { getFullMessage } from '../../../src/lib/curl-card'

export const prerender = false
export const GET: APIRoute = () =>
  new Response(getFullMessage(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
  })
