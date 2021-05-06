import { BaseData, FrontMatter } from './data'

export interface Post extends BaseData {
  category: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export type PostFrontMatter = FrontMatter<Post>
