import { z } from 'zod'

import { BaseDataSchema, FrontMatter } from './data'

export const ProjectSchema = BaseDataSchema.merge(
  z.object({
    stack: z.string().array(),
    source: z.string().optional(),
    live: z.string().optional(),
    wip: z.boolean().optional(),
    dead: z.boolean().optional(),
  })
)
export type Project = z.infer<typeof ProjectSchema>

export type ProjectFrontMatter = FrontMatter<Project>
