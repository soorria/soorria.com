import type { BaseFrontMatter } from '~/types/data'
import { bundleMDX } from 'mdx-bundler'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { nodeTypes } from '@mdx-js/mdx'
import { remarkTypeScriptTransform } from './remark.server'
import type { PluggableList } from 'unified'

const STYLE_UTILS = `
import { createElement } from 'react'
import { css } from 'goober'
export { css }
`

const codeBlockRemarkPlugins: PluggableList = [remarkTypeScriptTransform]

const codeBlockRehypePlugins: PluggableList = []

export type RenderOptions = {
  hasCodeBlocks?: boolean
}

export type RenderResult<T> = Awaited<ReturnType<typeof bundleMDX>> & {
  frontmatter: T
}

export const render = async <T extends BaseFrontMatter = BaseFrontMatter>(
  source: string,
  components = '',
  { hasCodeBlocks = true }: RenderOptions = {}
): Promise<RenderResult<T>> => {
  return bundleMDX<T>({
    source,
    files: {
      './components': components,
      $styles: STYLE_UTILS,
    },
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        ...(hasCodeBlocks ? codeBlockRemarkPlugins : []),
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypeRaw, { passThrough: nodeTypes }],
        rehypeSlug,
        ...(hasCodeBlocks ? codeBlockRehypePlugins : []),
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
