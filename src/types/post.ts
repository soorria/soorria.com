import type { BaseData, FrontMatter } from './data'

export interface Post extends BaseData {
  category: string
  createdAt: string
  updatedAt: string
  tags: string[]
  summary?: string
  private?: boolean
}

export type PostFrontMatter = FrontMatter<Post>
