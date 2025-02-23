import type { CollectionEntry } from 'astro:content'

export type DataType = 'snippets' | 'blog' | 'projects' | 'work' | 'misc'

export interface BaseData {
  slug: string
  title: string
  ogImageTitleParts?: string[]
  shortDescription: string
  code: string
  readingTime?: string
  words?: string
  hasContent: boolean
}

export type ApiData<T extends BaseData> = FrontMatter<T> & {
  content: string
  components: string
}
export type BaseApiData = ApiData<BaseData>

export type FrontMatter<T extends BaseData> = Omit<T, 'code'>
export type BaseFrontMatter = FrontMatter<BaseData>

export interface Snippet extends BaseData {
  category: string
  createdAt: string
  updatedAt?: string
  tags: string[]
  notMine?: boolean
}

export type SnippetFrontMatter = FrontMatter<Snippet>

export interface BlogPost extends BaseData {
  category: string
  createdAt: string
  updatedAt: string
  tags: string[]
  summary?: string
  private?: boolean
}

export type BlogPostFrontMatter = FrontMatter<BlogPost>

export interface Project extends BaseData {
  stack: string[]
  source?: string
  live?: string
  wip?: boolean
  dead?: boolean
}

export type ProjectFrontMatter = Pick<CollectionEntry<'projects'>, 'id' | 'data'>
