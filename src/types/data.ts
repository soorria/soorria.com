import { MdxRemote } from 'next-mdx-remote/types'

export enum DataType {
  snippets = 'snippets',
  posts = 'posts',
}

export interface BaseData {
  slug: string
  title: string
  created_at: string
  updated_at: string
  short_description: string
  mdxSource: MdxRemote.Source
}

export type FrontMatter<T extends BaseData> = Omit<T, 'mdxSource'>
export type BaseFrontMatter = FrontMatter<BaseData>
