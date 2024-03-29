import type { BaseData, FrontMatter } from './data'

export interface Snippet extends BaseData {
  category: string
  createdAt: string
  updatedAt?: string
  tags: string[]
  notMine?: boolean
}

export type SnippetFrontMatter = FrontMatter<Snippet>
