import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const prerender = false

export const GET: APIRoute = async () => {
  const snippets = await getCollection('snippets')

  const data = snippets
    .map(snippet => ({
      slug: snippet.id,
      title: snippet.data.title,
      shortDescription: snippet.data.shortDescription,
      category: snippet.data.category,
      tags: snippet.data.tags,
      createdAt: snippet.data.createdAt,
      updatedAt: snippet.data.updatedAt,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)
      return dateB.getTime() - dateA.getTime()
    })

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
