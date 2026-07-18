type ContentType = 'blog' | 'snippets' | 'projects' | 'misc'
type ContentModule = { default: unknown; frontmatter?: Record<string, unknown> }

const contentModules = import.meta.glob<ContentModule>(
  '../data/{blog,snippets,projects,misc}/*/index.mdx'
)

const moduleKey = (type: ContentType, slug: string) => `../data/${type}/${slug}/index.mdx`

export const getContentSlugs = (type: ContentType): string[] => {
  const prefix = `../data/${type}/`
  return Object.keys(contentModules)
    .filter(path => path.startsWith(prefix))
    .map(path => path.slice(prefix.length, -'/index.mdx'.length))
}

export const loadContent = async (type: ContentType, slug: string) => {
  const loader = contentModules[moduleKey(type, slug)]
  if (!loader) throw new Error(`No MDX content module for ${type}/${slug}`)
  return loader()
}
