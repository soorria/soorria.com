import { BaseData, FrontMatter } from './data'

export interface Snippet extends BaseData {
  category: string
  created_at: string
  updated_at: string
  tags: string[]
}

export type SnippetFrontMatter = FrontMatter<Snippet>
