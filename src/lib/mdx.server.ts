import type { BaseFrontMatter } from '~/types/data'
import { bundleMDX } from 'mdx-bundler'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { nodeTypes } from '@mdx-js/mdx'
import { remarkTypeScriptTransform } from './remark.server'
import rehypePrettyCode, { Options } from 'rehype-pretty-code'
import type { PluggableList } from 'unified'
import { Element } from 'hast'
import { rehypeRearrangePrettyCodeOutput } from './rehype.server'

const STYLE_UTILS = `
import { createElement } from 'react'
import { css } from 'goober'
export { css }
`

const codeBlockRemarkPlugins: PluggableList = [remarkTypeScriptTransform]

const codeBlockRehypePlugins: PluggableList = [
  [
    rehypePrettyCode,
    {
      theme: 'dracula', // Keep the background or use a custom background color?
      keepBackground: false,
      tokensMap: {
        fn: 'entity.name.function',
      },

      // Callback hooks to add custom logic to elements when visiting
      // them.
      onVisitLine(element: Element) {
        // Prevent lines from collapsing in `display: grid` mode, and
        // allow empty lines to be copy/pasted
        if (element.children.length === 0) {
          element.children = [{ type: 'text', value: ' ' }]
        }
      },
      onVisitHighlightedLine(element: Element) {
        // Each line element by default has `class="line"`.
        // @ts-expect-error cbs handling thss
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        element.properties?.className.push('line--highlighted')
      },
      onVisitHighlightedWord(element: Element, id) {
        // @ts-expect-error - cbs handling this
        element.properties.className = ['word']

        if (id) {
          // If the word spans across syntax boundaries (e.g. punctuation), remove
          // colors from the child elements.
          // @ts-expect-error - cbs handling this
          if (element.properties['data-rehype-pretty-code-wrapper']) {
            element.children.forEach(child => {
              // @ts-expect-error - cbs handling this
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              child.properties.style = ''
            })
          }

          // @ts-expect-error - cbs handling this
          element.properties.style = ''
          // @ts-expect-error - cbs handling this
          element.properties['data-word-id'] = id
        }
      },
    } satisfies Options,
  ],
  rehypeRearrangePrettyCodeOutput,
]

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
        ...(hasCodeBlocks ? codeBlockRehypePlugins : []),
        [rehypeRaw, { passThrough: nodeTypes }],
        rehypeSlug,
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
