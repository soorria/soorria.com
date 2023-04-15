export enum DataType {
  snippets = 'snippets',
  blog = 'blog',
  projects = 'projects',
  work = 'work',
  misc = 'misc',
}

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
