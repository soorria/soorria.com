import { nodeTypes } from '@mdx-js/mdx'
import mdxRollup from '@mdx-js/rollup'
import crypto from 'crypto'
import fs from 'fs'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import gfm from 'remark-gfm'
import remarkShikiTwoslash from 'remark-shiki-twoslash'
import { PluginOption, TransformResult } from 'vite'

const remarkTwoslash =
  typeof remarkShikiTwoslash === 'function'
    ? remarkShikiTwoslash
    : (remarkShikiTwoslash as { default: typeof remarkShikiTwoslash }).default

import { rehypeRearrangeShikiOutput } from '../lib/rehype.server'
import { remarkTypeScriptTransform } from '../lib/remark.server'

const wordsFormatter = Intl.NumberFormat('en', { notation: 'compact' } as Intl.NumberFormatOptions)

export const mdx = (): PluginOption => {
  const mdxPlugin = mdxRollup({
    jsx: true,
    jsxImportSource: 'solid-js',
    providerImportSource: 'solid-mdx',
    remarkPlugins: [
      gfm,
      remarkTypeScriptTransform,
      [
        remarkTwoslash,
        {
          theme: 'dracula',
          // langs: [ 'html', 'css', 'javascript', 'typescript', 'jsx', 'tsx', 'bash', 'yaml', 'toml', 'latex', 'r', 'haskell', 'csharp', 'astro', 'c', 'cpp', 'go', 'java', 'kotlin', 'markdown', 'matlab', 'mdx', 'perl', 'python', 'rust', 'bash', 'sql', 'svelte', 'vue', 'json', ],
          disableImplicitReactImport: true,
          defaultCompilerOptions: {
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            target: 'ESNext',
            module: 'esnext',
            lib: ['lib.dom.d.ts', 'lib.es2015.d.ts'],
            jsxImportSource: 'solid-js',
            jsx: 'preserve',
            types: ['solid-start/env'],
            paths: {
              '~/*': ['./src/*'],
            },
          },
        },
      ],
    ],
    rehypePlugins: [
      [rehypeRaw, { passThrough: nodeTypes }],
      rehypeSlug,
      rehypeRearrangeShikiOutput,
      [
        rehypeAutolinkHeadings,
        {
          behaviour: 'append',
          properties: { className: 'heading-anchor', ariaHidden: true, tabIndex: -1 },
          content: [],
        },
      ],
      rehypeAccessibleEmojis,
    ],
  }) as { transform: (code: string, id: string) => Promise<TransformResult> }

  type Matter = { content: string; data: Record<string, unknown> }

  type HrTime = [number, number]
  const timings: Record<string, { start: HrTime; taken?: HrTime }> = {}

  const frontMatterCache = new Map<string, Matter>()
  const getMatter = (id: string, code: string): Matter => {
    if (frontMatterCache.has(id)) return frontMatterCache.get(id) as Matter
    const { data, content } = matter(code)
    frontMatterCache.set(id, { data, content })
    return { data, content }
  }

  const codeCache = {
    key: (code: string) => crypto.createHash('md5').update(code).digest('hex'),
    has: (code: string) => fs.existsSync(`./.cache/mdx/${codeCache.key(code)}`),
    get: (code: string) => fs.readFileSync(`./.cache/mdx/${codeCache.key(code)}`, 'utf8'),
    set: (code: string, value: string) =>
      fs.writeFileSync(`./.cache/mdx/${codeCache.key(code)}`, value),
  }

  fs.mkdirSync('./.cache/mdx', { recursive: true })

  return [
    {
      name: 'mdx-meta',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('.mdx?meta') && !id.endsWith('.md?meta')) return

        const { data, content } = getMatter(id.replace('?meta', ''), code)

        const times = readingTime(content)
        const frontmatter = {
          ...data,
          hasContent: !!content,
          readingTime: times.text,
          words: `~${wordsFormatter.format(times.words)} words`,
        }

        return `export const frontMatter = ${JSON.stringify(frontmatter, null, 2)}`
      },
    },
    {
      ...mdxPlugin,
      name: 'mdx-content',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.endsWith('.mdx') && !id.endsWith('.md')) return

        code = getMatter(id, code).content

        const getCode = async () => {
          if (codeCache.has(code)) return codeCache.get(code)
          const result = await mdxPlugin.transform.call(this, code, id)
          codeCache.set(code, result.code)
          return result.code
        }

        const key = `mdx transform ${id.split('/').slice(-3).join('/')}`
        timings[key] = {
          start: process.hrtime(),
        }
        const transformed = await getCode()
        timings[key]!.taken = process.hrtime(timings[key]!.start)

        return transformed
      },
    },
    {
      name: 'time-reporter',
      enforce: 'post',
      buildEnd() {
        Object.entries(timings).forEach(([key, { taken: [s, ns] = [0, 0] }]) => {
          console.log(key, s || ns ? `${s}.${Math.round(ns / 1000)}s` : 'FAILED')
        })
      },
    },
  ]
}
