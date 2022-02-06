import { bundleMDX } from 'mdx-bundler'
import mdxPrism from 'mdx-prism'
import { BaseFrontMatter } from '@/types/data'

export type BundleResult<T extends BaseFrontMatter> = Omit<
  Awaited<ReturnType<typeof bundleMDX>>,
  'frontmatter'
> & {
  frontmatter: T
}

export const render = async <T extends BaseFrontMatter>(
  source: string
): Promise<BundleResult<T>> => {
  return bundleMDX<T>({
    source,
    xdmOptions(options) {
      options.rehypePlugins = [...(options.rehypePlugins ?? []), mdxPrism]
      return options
    },
  })
}
