import { type APIRoute } from 'astro'

export const GET: APIRoute = async ({}) => {
  return new Response('// TODO', {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
