import { nodeTypes } from '@mdx-js/mdx'
import { bundleMDX } from 'mdx-bundler'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkTwoslash from 'remark-shiki-twoslash'
import type { PluggableList } from 'unified'

import type { BaseFrontMatter } from '~/types/data'

import { rehypeRearrangeShikiOutput } from './rehype.server'
import { remarkTypeScriptTransform } from './remark.server'

const STYLE_UTILS = `
import { css } from 'goober'
export { css }
`

const codeBlockRemarkPlugins: PluggableList = [
  remarkTypeScriptTransform,
  [
    remarkTwoslash,
    {
      theme: 'dracula',
      langs: [
        'html',
        'css',
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'bash',
        'yaml',
        'toml',
        'latex',
        'r',
        'haskell',
        'csharp',
        'astro',
        'c',
        'cpp',
        'go',
        'java',
        'kotlin',
        'markdown',
        'matlab',
        'mdx',
        'perl',
        'python',
        'rust',
        'bash',
        'sql',
        'svelte',
        'vue',
        'json',
      ],
    },
  ],
]

const codeBlockRehypePlugins: PluggableList = [rehypeRearrangeShikiOutput]

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
