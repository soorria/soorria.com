import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import { getMdxOptions } from './src/lib/mdx.server'

const mdxOptions = getMdxOptions()

export default defineConfig({
  site: 'https://soorria.com',
  srcDir: './astro',
  outDir: './dist-astro',
  output: 'static',
  redirects: {
    '/blogs/[slug]': '/blog/[slug]',
    '/posts/[slug]': '/blog/[slug]',
    '/post/[slug]': '/blog/[slug]',
    '/p/[slug]': '/blog/[slug]',
    '/s/[slug]': '/snippets/[slug]',
    '/snippet/[slug]': '/snippets/[slug]',
    '/cypress': '/snippets/cypress',
    '/enzyme': '/snippets/enzyme',
    '/diy-promise-all': '/blog/promise-all',
    '/art': '/authentic-artistique-endevours',
    '/installations': '/authentic-artistique-endevours',
    '/contact': '/?ref=/contact#contact',
    '/src': 'https://github.com/soorria/soorria.com',
    '/stats': 'https://plausible.mooth.tech/mooth.tech',
  },
  adapter: vercel({
    includeFiles: ['./src/data'],
  }),
  markdown: {
    processor: unified({
      remarkPlugins: mdxOptions.remarkPlugins,
      rehypePlugins: mdxOptions.rehypePlugins,
    }),
  },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname,
        '~data': new URL('./src/data', import.meta.url).pathname,
      },
    },
  },
})
