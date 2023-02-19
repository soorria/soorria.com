import { z } from 'zod'

export const DataTypeSchema = z.enum(['snippets', 'blog', 'projects', 'misc'])
export type DataType = z.infer<typeof DataTypeSchema>

export type ApiData<T extends BaseData> = T & {
  content: string
  components: string
}
export type BaseApiData = ApiData<BaseData>

export const BaseDataSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  readingTime: z.string().optional(),
  words: z.string().optional(),
  hasContent: z.boolean(),
})
export type BaseData = z.infer<typeof BaseDataSchema>
