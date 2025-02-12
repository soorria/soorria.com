import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content_layer',

  loader: glob({
    pattern: '*/*.{md,mdx}',
    base: './src/data/projects',
  }),

  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    stack: z.string().array(),
    live: z.string().url().optional(),
    source: z.string().url().optional(),
    wip: z.boolean().optional().default(false),
    hasContent: z.boolean().optional().default(false),
  }),
})

export const collections = {
  projects,
}
