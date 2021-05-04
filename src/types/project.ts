import { BaseData, FrontMatter } from './data'

export interface Project extends BaseData {
  stack: string[]
  source?: string
  live?: string
  hasDetailsPage?: boolean
}

export type ProjectFrontMatter = FrontMatter<Project>
