import { z } from 'zod'

import { BaseDataSchema, FrontMatter } from './data'

export const BlogPostSchema = BaseDataSchema.merge(
  z.object({
    category: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.string().array(),
    notMine: z.boolean().optional(),
    private: z.boolean().optional(),
  })
)
export type BlogPost = z.infer<typeof BlogPostSchema>

export type BlogPostFrontMatter = FrontMatter<BlogPost>
