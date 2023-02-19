import { ZodSchema } from 'zod'

import { BlogPostSchema } from '~/types/blog-post'
import { BaseData, BaseDataSchema } from '~/types/data'
import { ProjectSchema } from '~/types/project'
import { SnippetSchema } from '~/types/snippet'

import { addRefToUrl } from '../utils/content'

const hasLiveUrlProperty = (obj: unknown): obj is { live: string } =>
  Boolean(obj) && typeof (obj as { live: unknown }).live === 'string'

const slugFromId = (id: string): string => id.split('/').at(-2) ?? ''

const getDataDefs = <Data extends BaseData>(
  modules: Record<string, unknown>,
  schema: ZodSchema<Data>
): { list: Data[]; bySlug: Record<string, Data> } => {
  const asList = Object.entries(modules).map(([key, value]) => {
    const id = key.replace(/\.mdx?/i, '')
    const slug = slugFromId(id)
    const { frontMatter } = value as { frontMatter: Record<string, unknown> }
    const validated = schema.parse({
      slug,
      ...frontMatter,
    }) as Data
    if (hasLiveUrlProperty(validated)) {
      validated.live = addRefToUrl(validated.live)
    }
    return validated
  })

  return {
    list: asList,
    bySlug: asList.reduce((acc, item) => {
      acc[item.slug] = item
      return acc
    }, {} as Record<string, Data>),
  }
}

export const projectFrontMatters = getDataDefs(
  import.meta.glob('~/data/projects/*/index.mdx', { eager: true, query: { meta: '' } }),
  ProjectSchema
)

export const snippetFrontMatters = getDataDefs(
  import.meta.glob('~/data/snippets/*/index.mdx', { eager: true, query: { meta: '' } }),
  SnippetSchema
)

export const blogFrontMatters = getDataDefs(
  import.meta.glob('~/data/blog/*/index.mdx', { eager: true, query: { meta: '' } }),
  BlogPostSchema
)

export const miscFrontMatters = getDataDefs(
  import.meta.glob('~/data/misx/*/index.mdx', { eager: true, query: { meta: '' } }),
  BaseDataSchema
)

export const dataByType = {
  projects: projectFrontMatters,
  snippets: snippetFrontMatters,
  blog: blogFrontMatters,
  misc: miscFrontMatters,
}
