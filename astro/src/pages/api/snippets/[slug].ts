import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const snippets = await getCollection('snippets')
  const snippet = snippets.find(s => s.id === slug)

  if (!snippet) {
    return new Response(JSON.stringify({ error: 'Snippet not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = {
    slug: snippet.id,
    title: snippet.data.title,
    shortDescription: snippet.data.shortDescription,
    category: snippet.data.category,
    tags: snippet.data.tags,
    createdAt: snippet.data.createdAt,
    updatedAt: snippet.data.updatedAt,
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
