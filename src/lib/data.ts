import type { BaseData, DataType, FrontMatter, BaseApiData } from '@/types/data'
import type { PathLike } from 'fs'
import { promises as fs } from 'fs'
import readingTime from 'reading-time'
import matter from 'gray-matter'
import path from 'path'
import { render } from './mdx.server'
import { addRefToUrl } from '../utils/content'

const DATA_ROOT = path.join(process.cwd(), '_data')

const getTypePath = (type: DataType): string => path.join(DATA_ROOT, type)
const getFilePath = (type: DataType, slug: string, file?: typeof files[number]): string =>
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
    words: wordsFormatter.format(times.words),
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
    content,
    components,
    hasContent: content.trim().length !== 0,
    ...getContentMetrics(content),
  } as TApiData
}

const hasLiveUrlProperty = (obj: unknown): obj is { live: string } =>
  Boolean(obj) && typeof (obj as { live: unknown }).live === 'string'

export const getFileWithMdx = async <TData extends BaseData>(
  type: DataType,
  slug: string
): Promise<TData> => {
  const { mdx, components } = await readFilesForSlug(type, slug)

  const {
    code,
    frontmatter: data,
    matter: { content },
  } = await render<FrontMatter<TData>>(mdx, components)

  if (hasLiveUrlProperty(data)) {
    data.live = addRefToUrl(data.live)
  }

  return {
    ...(data as FrontMatter<TData>),
    slug,
    code,
    hasContent: content.trim().length !== 0,
    ...getContentMetrics(content),
  } as TData
}
