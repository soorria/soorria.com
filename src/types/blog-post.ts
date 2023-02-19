import { z } from 'zod'

import { BaseDataSchema } from './data'

export const BlogPostSchema = BaseDataSchema.merge(
  z.object({
    category: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    tags: z.string().array(),
    notMine: z.boolean().optional(),
    private: z.boolean().optional(),
  })
)
export type BlogPost = z.infer<typeof BlogPostSchema>
