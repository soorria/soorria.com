import { Feed } from 'feed'
import { getCollection } from 'astro:content'
import { PUBLIC_URL } from '~/constants'
import { getOgImageForData } from '~/utils/og'

function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function createFeed() {
  const feed = new Feed({
    title: 'Soorria Saruva',
    description: 'Full Stack Software Engineer',
    copyright: 'All rights reserved Soorria Saruva',

    id: 'https://soorria.com',
    link: 'https://soorria.com',
    image: 'https://soorria.com/og.png',
    language: 'en',

    feedLinks: {
      rss: 'https://soorria.com/rss',
      atom: 'https://soorria.com/atom',
    },

    author: {
      name: 'Soorria Saruva',
      email: 'soorria.ss@gmail.com',
      link: 'https://soorria.com',
    },

    generator: 'hopes and dreams',
  })

  // Get all blog posts and snippets
  const [blogPosts, snippets] = await Promise.all([
    getCollection('blog'),
    getCollection('snippets'),
  ])

  const allPosts = [
    ...blogPosts.map(post => ({
      type: 'blog' as const,
      slug: post.id,
      title: post.data.title,
      shortDescription: post.data.shortDescription,
      createdAt: post.data.createdAt,
      updatedAt: post.data.updatedAt,
    })),
    ...snippets.map(snippet => ({
      type: 'snippets' as const,
      slug: snippet.id,
      title: snippet.data.title,
      shortDescription: snippet.data.shortDescription,
      createdAt: snippet.data.createdAt,
      updatedAt: snippet.data.updatedAt,
    })),
  ].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0)
    const dateB = new Date(b.createdAt || 0)
    return dateB.getTime() - dateA.getTime()
  })

  for (const post of allPosts) {
    if (!post.createdAt) continue

    feed.addItem({
      id: `${post.type}/${post.slug}`,
      link: `${PUBLIC_URL}/${post.type}/${post.slug}`,
      title: post.title,
      description: post.shortDescription,
      image: {
        url: htmlEscape(getOgImageForData(post.type, post.title).url),
        type: 'image/png',
        length: 21300,
      },
      published: new Date(post.createdAt),
      date: new Date(post.updatedAt || post.createdAt),
    })
  }

  return feed
}
