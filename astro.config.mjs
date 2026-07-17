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
    '/blogs/[slug]': { destination: '/blog/[slug]', status: 308 },
    '/posts/[slug]': { destination: '/blog/[slug]', status: 308 },
    '/post/[slug]': { destination: '/blog/[slug]', status: 308 },
    '/p/[slug]': { destination: '/blog/[slug]', status: 308 },
    '/s/[slug]': { destination: '/snippets/[slug]', status: 308 },
    '/snippet/[slug]': { destination: '/snippets/[slug]', status: 308 },
    '/art': { destination: '/authentic-artistique-endevours', status: 307 },
    '/installations': { destination: '/authentic-artistique-endevours', status: 307 },
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
    server: {
      allowedHosts: ['.soorria.com'],
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname,
        '~data': new URL('./src/data', import.meta.url).pathname,
      },
    },
  },
})
