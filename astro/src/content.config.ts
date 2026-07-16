import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blogCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    createdAt: z.string().optional(), // Some drafts don't have dates
    updatedAt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    private: z.boolean().optional(),
    summary: z.string().optional(),
  }),
})

const snippetsCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/snippets' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    category: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    tags: z.array(z.string()),
    notMine: z.boolean().optional(),
  }),
})

const projectsCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    stack: z.array(z.string()),
    source: z.string().optional(),
    live: z.string().optional(),
    wip: z.boolean().optional(),
    dead: z.boolean().optional(),
  }),
})

const miscCollection = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/misc' }),
  schema: z.object({
    title: z.string(),
    updatedAt: z.string().optional(),
  }),
})

export const collections = {
  blog: blogCollection,
  snippets: snippetsCollection,
  projects: projectsCollection,
  misc: miscCollection,
}
