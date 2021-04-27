import { MdxRemote } from 'next-mdx-remote/types'

export enum DataType {
  snippets = 'snippets',
  posts = 'posts',
  projects = 'projects',
  work = 'work',
  misc = 'misc',
}

export interface BaseData {
  slug: string
  title: string
  shortDescription: string
  mdxSource: MdxRemote.Source
  readingTime?: string
}

export type ApiData<T extends BaseData> = Omit<T, 'mdxSource'> & { content: string }
export type BaseApiData = ApiData<BaseData>

export type FrontMatter<T extends BaseData> = Omit<T, 'mdxSource'>
export type BaseFrontMatter = FrontMatter<BaseData>
