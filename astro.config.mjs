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
