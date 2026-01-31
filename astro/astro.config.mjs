// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'

// https://astro.build/config
export default defineConfig({
  site: 'https://soorria.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'dracula',
            keepBackground: false,
            tokensMap: { fn: 'entity.name.function' },
            onVisitLine(element) {
              if (element.children.length === 0) {
                element.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(element) {
              element.properties.className?.push('line--highlighted')
            },
          },
        ],
        rehypeRaw,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behaviour: 'append',
            properties: {
              className: 'heading-anchor',
              ariaHidden: true,
              tabIndex: -1,
            },
            content: [],
          },
        ],
        rehypeAccessibleEmojis,
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': '/src',
        '~next': '../next-16/src',
      },
    },
  },
  // Static redirects only - dynamic redirects go in vercel.json
  redirects: {
    '/stats': 'https://plausible.mooth.tech/mooth.tech',
    '/src': 'https://github.com/soorria/soorria.com',
    '/cypress': '/snippets/cypress',
    '/enzyme': '/snippets/enzyme',
    '/diy-promise-all': '/blog/promise-all',
    '/art': '/authentic-artistique-endevours',
  },
})
