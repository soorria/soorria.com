import type { APIRoute } from 'astro'
export const prerender = false
export const GET: APIRoute = ({ redirect }) =>
  redirect('/api/og?title=Soorria%20Saruva&subtitle=soorria.com', 307)
