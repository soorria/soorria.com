import { ApiData, BaseData, FrontMatter } from './data'

export interface Work extends BaseData {
  company: string
  from: string
  to?: string
  tech_used?: string[]
  location: string
}

export type WorkFrontMatter = FrontMatter<Work>
export type WorkApiData = ApiData<Work>
