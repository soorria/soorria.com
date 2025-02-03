import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { nodeTypes } from '@mdx-js/mdx'
import { remarkTypeScriptTransform } from './remark.server'
import rehypePrettyCode, { type Options } from 'rehype-pretty-code'
import type { PluggableList } from 'unified'
import { rehypeRearrangePrettyCodeOutput } from './rehype.server'
import { type SerializeOptions } from 'next-mdx-remote/dist/types'

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
      onVisitLine(element) {
        // Prevent lines from collapsing in `display: grid` mode, and
        // allow empty lines to be copy/pasted
        if (element.children.length === 0) {
          element.children = [{ type: 'text', value: ' ' }]
        }
      },
      onVisitHighlightedLine(element) {
        // Each line element by default has `class="line"`.

        const properties = element.properties as { className?: string[] }

        properties.className?.push('line--highlighted')
      },
      onVisitHighlightedWord(element, id) {
        const properties = element.properties as {
          className?: string[]
          'data-rehype-pretty-code-wrapper'?: boolean
          style?: string
          'data-word-id'?: string
        }

        properties.className = ['word']

        if (id) {
          // If the word spans across syntax boundaries (e.g. punctuation), remove
          // colors from the child elements.
          if (properties['data-rehype-pretty-code-wrapper']) {
            element.children.forEach(child => {
              // @ts-expect-error - cbs handling this
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              child.properties.style = ''
            })
          }

          properties.style = ''
          properties['data-word-id'] = id
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
