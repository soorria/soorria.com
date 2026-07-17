import type { APIRoute } from 'astro'

export const temporaryRedirect =
  (location: string): APIRoute =>
  () =>
    new Response(null, { status: 307, headers: { Location: location } })
