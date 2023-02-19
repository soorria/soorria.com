import { z } from 'zod'

export const DataTypeSchema = z.enum(['snippets', 'blog', 'projects', 'misc'])
export type DataType = z.infer<typeof DataTypeSchema>

export const BaseDataSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  code: z.string(),
  readingTime: z.string().optional(),
  words: z.string().optional(),
  hasContent: z.boolean(),
})
export type BaseData = z.infer<typeof BaseDataSchema>

export type ApiData<T extends BaseData> = FrontMatter<T> & {
  content: string
  components: string
}
export type BaseApiData = ApiData<BaseData>

export type FrontMatter<T extends BaseData> = Omit<T, 'code'>
export type BaseFrontMatter = FrontMatter<BaseData>
