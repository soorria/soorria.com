import type { BaseFrontMatter } from '@/types/data'
import type { Awaited } from '@/utils/types'
import { bundleMDX } from 'mdx-bundler'
import mdxPrism from 'mdx-prism'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { rehypeCodeTitles } from './rehype.server'

const STYLE_UTILS = `
import { createElement } from 'react'
import { setup, styled, css } from 'goober'
setup(createElement)
export { styled, css }
`

export type BundleResult<T extends BaseFrontMatter> = Omit<
  Awaited<ReturnType<typeof bundleMDX>>,
  'frontmatter'
> & {
  frontmatter: T
}

export const render = async <T extends BaseFrontMatter>(
  source: string,
  components = ''
): Promise<BundleResult<T>> => {
  return bundleMDX<T>({
    source,
    files: {
      './components': components,
      $styles: STYLE_UTILS,
    },
    xdmOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeCodeTitles,
        mdxPrism,
        [
          rehypeAutolinkHeadings,
          {
            behaviour: 'append',
            properties: { className: 'heading-anchor', ariaHidden: true, tabIndex: -1 },
            content: [],
          },
        ],
        rehypeAccessibleEmojis,
      ]
      return options
    },
  })
}
