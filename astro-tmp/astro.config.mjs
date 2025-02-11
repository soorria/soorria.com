// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react({
      include: ["./src/**/*.react.tsx"],
    }),
    mdx(),
    sitemap(),
  ],
  adapter: vercel(),

  site: "https://soorria.com",
  devToolbar: {
    enabled: true,
  },

  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },

  trailingSlash: "never",

  redirects: {},
});
