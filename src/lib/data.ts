import type { BaseData, DataType, FrontMatter, BaseApiData } from '~/types/data'
import type { PathLike } from 'fs'
import { promises as fs } from 'fs'
import readingTime from 'reading-time'
import matter from 'gray-matter'
import path from 'path'
import { addRefToUrl, blogPostFilter, sortByCreatedAtField } from '../utils/content'
import { unstable_cache } from 'next/cache'
import type { SnippetFrontMatter } from '~/types/snippet'
import type { BlogPostFrontMatter } from '~/types/blog-post'

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

export const getFiles = async (type: DataType): Promise<string[]> => fs.readdir(getTypePath(type))

const COMPONENTS_FILE = 'components.js' as const
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

export const getAllFilesFrontMatter = async <TFrontMatter>(
  type: DataType
): Promise<TFrontMatter[]> => {
  const files = await getFiles(type)

  return Promise.all(
    files.map(async slug => {
      const source = await fs.readFile(getFilePath(type, slug))
      const { data, content } = matter(source)

      return {
        ...(data as TFrontMatter),
        slug: fileToSlug(slug),
        hasContent: content.trim().length !== 0,
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
    ...(data as TFrontMatter),
    slug,
    hasContent: content.trim().length !== 0,
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
    ...(data as any),
    slug,
    code: content,
    components,
    hasContent: content.trim().length !== 0,
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

  const { data, content } = matter(mdx)

  if (hasLiveUrlProperty(data)) {
    data.live = addRefToUrl(data.live)
  }

  return {
    ...(data as FrontMatter<TData>),
    slug,
    /**
     * Unrendered MDX
     */
    code: content,
    hasContent: content.trim().length !== 0,
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
