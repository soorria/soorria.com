import { z } from 'zod'

import { BaseDataSchema, FrontMatter } from './data'

export const SnippetSchema = BaseDataSchema.merge(
  z.object({
    category: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.string().array(),
    notMine: z.boolean().optional(),
  })
)
export type Snippet = z.infer<typeof SnippetSchema>

export type SnippetFrontMatter = FrontMatter<Snippet>
