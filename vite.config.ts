import solid from 'solid-start/vite'
import vercel from 'solid-start-vercel'
import { mdx } from './src/vite/mdx'
import { defineConfig } from 'vite'
import { FontaineTransform } from 'fontaine'

export default defineConfig(async () => ({
  plugins: [
    await mdx(),
    FontaineTransform.vite({
      fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'],
      // You may need to resolve assets like `/fonts/Roboto.woff2` to a particular directory
      resolvePath: id => 'file://./public/fonts' + id,
    }),
    solid({
      adapter: vercel({
        // @ts-ignore
        // prerender: true,
      }),
    }),
  ],
  envDir: '.',
}))
