const migratedBlogModules = {
  'event-delegation': () => import('../../src/data/blog/event-delegation/index.mdx'),
} as const

export type MigratedBlogSlug = keyof typeof migratedBlogModules

export const getMigratedBlogSlugs = (): MigratedBlogSlug[] =>
  Object.keys(migratedBlogModules) as MigratedBlogSlug[]

export const loadMigratedBlogContent = (slug: MigratedBlogSlug) => migratedBlogModules[slug]()
