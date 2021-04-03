import { MdxRemote } from 'next-mdx-remote/types'

export enum DataType {
  snippets = 'snippets',
  posts = 'posts',
  projects = 'projects',
  misc = 'misc',
}

export interface BaseData {
  slug: string
  title: string
  short_description: string
  mdxSource: MdxRemote.Source
}

export type FrontMatter<T extends BaseData> = Omit<T, 'mdxSource'>
export type BaseFrontMatter = FrontMatter<BaseData>
