export type DataType = 'snippets' | 'blog' | 'projects' | 'work' | 'misc'

export interface BaseData {
  slug: string
  title: string
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
