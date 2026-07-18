import type { APIRoute } from 'astro'
import { getAllFilesFrontMatter } from '~/lib/data'
import type { BlogPostFrontMatter } from '~/types/blog-post'
import type { SnippetFrontMatter } from '~/types/snippet'
import { blogPostFilter } from '~/utils/content'

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
export const GET: APIRoute = async () => {
  const [blogs, snippets] = await Promise.all([
    getAllFilesFrontMatter<BlogPostFrontMatter>('blog'),
    getAllFilesFrontMatter<SnippetFrontMatter>('snippets'),
  ])
  const staticPaths = [
    '',
    '/about',
    '/all-posts',
    '/authentic-artistique-endevours',
    '/blog',
    '/links',
    '/projects',
    '/secrets',
    '/snippets',
    '/uses',
    '/installations/magic-sprinkles',
  ]
  const paths = [
    ...staticPaths,
    ...blogPostFilter(blogs).map(p => `/blog/${p.slug}`),
    ...snippets.map(p => `/snippets/${p.slug}`),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escape(`https://soorria.com${path || '/'}`)}</loc></url>`).join('')}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
