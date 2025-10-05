import globby from 'globby'
import type { MetadataRoute } from 'next'
import { getAllPosts } from '~/lib/data'

const PAGES_DIR = 'src/app'
const BASE_URL = 'https://soorria.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await Promise.all([getStaticPages(), getPostPages()]))
    .flat()
    .sort((a, b) => a.url.localeCompare(b.url))
}

function pageFileToUrl(pageFile: string): string {
  const fileWithoutPagesAndExtension = pageFile.replace(PAGES_DIR, '').replace('/page.tsx', '')
  const parts = fileWithoutPagesAndExtension.split('/')
  const partsWithoutLayoutSegments = parts.filter(part => !part.includes('('))
  return partsWithoutLayoutSegments.join('/')
}

async function getStaticPages(): Promise<MetadataRoute.Sitemap> {
  const pageFiles = await globby([`${PAGES_DIR}/**/page.tsx`])

  const pages = pageFiles
    .map(pageFile => pageFileToUrl(pageFile))
    // Ignore dynamic route files
    .filter(page => !page.includes('['))

  return pages.map(page => ({
    url: `${BASE_URL}${page}`,
    priority: 0.7,
    changeFrequency: 'daily',
  }))
}

async function getPostPages(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  return posts
    .filter(post => post.createdAt)
    .map(post => ({
      url: `${BASE_URL}/${post.type}/${post.slug}`,
      lastModified: post.updatedAt ?? post.createdAt,
      priority: 0.7,
      changeFrequency: 'daily',
    }))
}
