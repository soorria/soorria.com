import { BaseData, FrontMatter } from './data'

export interface Snippet extends BaseData {
  types: string[]
}

export type SnippetFrontMatter = FrontMatter<Snippet>
