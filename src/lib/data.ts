import { BaseData, DataType, FrontMatter, BaseApiData } from '@/types/data'
import { promises as fs } from 'fs'
import readingTime from 'reading-time'
import matter from 'gray-matter'
import path from 'path'
import { render } from './mdx-render'

const DATA_ROOT = path.join(process.cwd(), '_data')

const getTypePath = (type: DataType): string => path.join(DATA_ROOT, type)
const getFilePath = (type: DataType, file: string): string => path.join(DATA_ROOT, type, file)
const getSlugPath = (type: DataType, slug: string): string => getFilePath(type, slug + '.mdx')
const fileToSlug = (file: string): string => file.replace(/\.mdx$/, '')

export const getFiles = async (type: DataType): Promise<string[]> => fs.readdir(getTypePath(type))

export const getAllFilesFrontMatter = async <TFrontMatter>(
  type: DataType
): Promise<TFrontMatter[]> => {
  const files = await getFiles(type)

  return Promise.all(
    files.map(async file => {
      const source = await fs.readFile(getFilePath(type, file))
      const { data, content } = matter(source)

      return {
        ...(data as TFrontMatter),
        slug: fileToSlug(file),
        readingTime: readingTime(content).text,
        hasContent: content.trim().length !== 0,
      } as TFrontMatter
    })
  )
}

export const getFileWithoutMdx = async <TApiData extends BaseApiData>(
  type: DataType,
  slug: string
): Promise<TApiData> => {
  const source = await fs.readFile(getSlugPath(type, slug), 'utf-8')
  const { data, content } = matter(source)

  return {
    ...(data as any),
    slug,
    content,
    readingTime: readingTime(content).text,
  } as TApiData
}

export const getFileWithMdx = async <TData extends BaseData>(
  type: DataType,
  slug: string
): Promise<TData> => {
  const source = await fs.readFile(getSlugPath(type, slug), 'utf-8')
  const { data, content } = matter(source)

  const mdxSource = await render(content)

  return {
    ...(data as FrontMatter<TData>),
    slug,
    mdxSource,
    readingTime: readingTime(content).text,
  } as TData
}
