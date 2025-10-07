import type { BaseData, DataType, FrontMatter, BaseApiData, BaseFrontMatter } from '~/types/data'
import type { PathLike } from 'fs'
import { promises as fs } from 'fs'
import readingTime from 'reading-time'
import matter from 'gray-matter'
import path from 'path'
import { addRefToUrl, blogPostFilter, sortByCreatedAtField } from '../utils/content'
import type { SnippetFrontMatter } from '~/types/snippet'
import type { BlogPostFrontMatter } from '~/types/blog-post'
import { Feed } from 'feed'
import { PUBLIC_URL } from '~/constants'
import { getOgImageForData } from '~/utils/og'
import { htmlEscape } from '~/utils/html-escape'

const DATA_ROOT = path.join(process.cwd(), 'src/data')

const getTypePath = (type: DataType): string => path.join(DATA_ROOT, type)
const getFilePath = (type: DataType, slug: string, file?: (typeof files)[number]): string =>
  path.join(DATA_ROOT, type, slug, file ? file : 'index.mdx')
const fileToSlug = (file: string): string => file.replace(/\.mdx$/, '')

const isFile = (path: PathLike): Promise<boolean> =>
  fs
    .stat(path)
    .then(stat => stat.isFile())
    .catch(() => false)

const getFiles = async (type: DataType): Promise<string[]> => fs.readdir(getTypePath(type))

const COMPONENTS_FILE = 'components.js' as const
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const files = [COMPONENTS_FILE, 'index.mdx'] as const

const wordsFormatter = Intl.NumberFormat('en', { notation: 'compact' } as Intl.NumberFormatOptions)

const getContentMetrics = (content: string): { readingTime: string; words: string } => {
  const times = readingTime(content)
  return {
    readingTime: times.text,
    words: `~${wordsFormatter.format(times.words)} words`,
  }
}

const readFilesForSlug = async (
  type: DataType,
  slug: string
): Promise<{ mdx: string; components: string }> => {
  const mdxPath = getFilePath(type, slug)
  const componentsPath = getFilePath(type, slug, COMPONENTS_FILE)

  const [mdx, components] = await Promise.all([
    fs.readFile(mdxPath, { encoding: 'utf-8' }),
    isFile(componentsPath).then(isFile =>
      isFile ? fs.readFile(componentsPath, { encoding: 'utf-8' }) : ''
    ),
  ])

  return { mdx, components }
}

function resolveData<T extends BaseFrontMatter>(data: Record<string, unknown>, content: string): T {
  const typedData = data as T

  return {
    ...typedData,
    hasContent: content.trim().length !== 0,
  }
}

export const getAllFilesFrontMatter = async <TFrontMatter>(
  type: DataType
): Promise<TFrontMatter[]> => {
  const files = await getFiles(type)

  return Promise.all(
    files.map(async slug => {
      const source = await fs.readFile(getFilePath(type, slug))
      const { data, content } = matter(source)

      return {
        ...resolveData(data, content),
        slug: fileToSlug(slug),
        ...getContentMetrics(content),
      } as TFrontMatter
    })
  )
}

export const getFileFrontMatter = async <TFrontMatter>(
  type: DataType,
  slug: string
): Promise<TFrontMatter> => {
  const source = await fs.readFile(getFilePath(type, slug), 'utf-8')
  const { data, content } = matter(source)

  return {
    ...resolveData(data, content),
    slug,
    ...getContentMetrics(content),
  } as TFrontMatter
}

export const getFileWithContent = async <TApiData extends BaseApiData>(
  type: DataType,
  slug: string
): Promise<TApiData> => {
  const { mdx, components } = await readFilesForSlug(type, slug)
  const { data, content } = matter(mdx)

  return {
    ...resolveData(data, content),
    slug,
    code: content,
    components,
    ...getContentMetrics(content),
  } as TApiData
}

const hasLiveUrlProperty = (obj: unknown): obj is { live: string } =>
  Boolean(obj) && typeof (obj as { live: unknown }).live === 'string'

export const getFileForMdx = async <TData extends BaseData>(
  type: DataType,
  slug: string
): Promise<TData> => {
  const { mdx } = await readFilesForSlug(type, slug)

  const { data: _data, content } = matter(mdx)
  const data = _data as FrontMatter<TData>

  if (hasLiveUrlProperty(data)) {
    data.live = addRefToUrl(data.live)
  }

  return {
    ...resolveData(data, content),
    slug,
    /**
     * Unrendered MDX
     */
    code: content,
    ...getContentMetrics(content),
  } as TData
}

export const getAllPosts = async () => {
  const [snippets, blogPosts] = await Promise.all([
    getAllFilesFrontMatter<SnippetFrontMatter>('snippets'),
    getAllFilesFrontMatter<BlogPostFrontMatter>('blog'),
  ])

  return [
    ...snippets.map(s => ({ ...s, type: 'snippets' as const })),
    ...blogPostFilter(blogPosts).map(p => ({ ...p, type: 'blog' as const })),
  ].map(p => ({ ...p, width: p.type === 'snippets' ? 1 : 2 }))
}

export type AllPostsItem = Awaited<ReturnType<typeof getAllPosts>>[number]

export const sortPostsForRender = (posts: AllPostsItem[]) => {
  const sortedByCreated = sortByCreatedAtField(posts)

  // Reorder posts so that they match the order when rendered
  // with `grid-auto-flow: dense`
  const result: typeof sortedByCreated = []
  let buffer: (typeof sortedByCreated)[number] | null = null
  for (const post of sortedByCreated) {
    if (post.width === 1) {
      if (buffer) {
        result.push(buffer)
        buffer = null
        result.push(post)
      } else {
        buffer = post
      }
    } else {
      result.push(post)
    }
  }
  if (buffer) {
    result.push(buffer)
  }

  return result
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
      rss: 'https://soorria.com/rss.xml',
      atom: 'https://soorria.com/atom.xml',
    },

    author: {
      name: 'Soorria Saruva',
      avatar: 'https://soorria.com/logo.png',
      email: 'soorria.ss@gmail.com',
      link: 'https://soorria.com',
    },

    generator: 'hopes and dreams',
  })

  const posts = await getAllPosts()

  for (const post of posts) {
    if (!post.createdAt) continue

    feed.addItem({
      id: `${post.type}/${post.slug}`,
      link: `${PUBLIC_URL}/${post.type}/${post.slug}`,
      title: post.title,
      description: post.shortDescription,
      image: {
        url: htmlEscape(getOgImageForData(post.type, post.title, post.ogImageTitleParts).url),
        type: 'image/png',
        length: 21300,
      },
      published: new Date(post.createdAt),
      date: new Date(post.updatedAt || post.createdAt),
    })
  }

  return feed
}
