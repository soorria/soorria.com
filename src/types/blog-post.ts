import type { BaseData, FrontMatter } from './data'

export interface BlogPost extends BaseData {
  category: string
  createdAt: string
  updatedAt: string
  tags: string[]
  summary?: string
  private?: boolean
}

export type BlogPostFrontMatter = FrontMatter<BlogPost>
