import type { BaseData, FrontMatter } from './data'

export interface Project extends BaseData {
  stack: string[]
  source?: string
  live?: string
  wip?: boolean
  dead?: boolean
}

export type ProjectFrontMatter = FrontMatter<Project>
