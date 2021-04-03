import { BaseData, FrontMatter } from './data'

export interface Project extends BaseData {
  stack: string[]
  source?: string
  live: string
}

export type ProjectFrontMatter = FrontMatter<Project>
