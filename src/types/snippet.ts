import { BaseData, FrontMatter } from './data'

export interface Snippet extends BaseData {
  category: string
}

export type SnippetFrontMatter = FrontMatter<Snippet>
