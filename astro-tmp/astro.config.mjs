// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'
import Inspect from 'vite-plugin-inspect'

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://soorria.com',

  env: {
    schema: {
      SUPABASE_ANON_KEY: envField.string({ context: 'server', access: 'public' }),
      SUPABASE_URL: envField.string({ context: 'server', access: 'public' }),
    },
  },

  vite: {
    plugins: [tailwindcss(), Inspect()],
  },
  integrations: [react(), mdx(), sitemap()],
  adapter: vercel({
    edgeMiddleware: true,
    imageService: true,
    isr: {
      expiration: 10,
    },
  }),

  devToolbar: {
    enabled: false,
  },

  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },

  trailingSlash: 'never',

  redirects: {},
})
