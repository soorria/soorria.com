import type { BaseFrontMatter } from '@/types/data'
import { bundleMDX } from 'mdx-bundler'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { rehypeCodeTitles } from './rehype.server'
import { remarkTypeScriptTransform } from './remark.server'

const STYLE_UTILS = `
import { createElement } from 'react'
import { setup, styled, css } from 'goober'
setup(createElement)
export { styled, css }
`

export const render = async <T extends BaseFrontMatter>(source: string, components = '') => {
  return bundleMDX<T>({
    source,
    files: {
      './components': components,
      ...(source.includes('$styles') ? { $styles: STYLE_UTILS } : null),
    },
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkTypeScriptTransform]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
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
