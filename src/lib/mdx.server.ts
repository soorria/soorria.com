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
import { SerializeOptions } from 'next-mdx-remote/dist/types'

import _draculaTheme from 'shiki/themes/dracula.json'

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

export const getMdxOptions = ({ hasCodeBlocks = true }: RenderOptions = {}) => {
  const remarkPlugins = [remarkGfm, ...(hasCodeBlocks ? codeBlockRemarkPlugins : [])]
  const rehypePlugins = [
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
  return {
    remarkPlugins,
    rehypePlugins,
  } as SerializeOptions['mdxOptions']
}
