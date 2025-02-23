import type { ApiData, BaseData, FrontMatter } from '../../astro-tmp/src/lib/data/data'

export interface Work extends BaseData {
  company: string
  from: string
  to?: string
  techUsed?: string[]
  location: string
}

export type WorkFrontMatter = FrontMatter<Work>
export type WorkApiData = ApiData<Work>
