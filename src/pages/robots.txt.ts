import type { APIRoute } from 'astro'
export const GET: APIRoute = () =>
  new Response(
    '# *\nUser-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\n# Host\nHost: https://soorria.com\n\n# Sitemaps\nSitemap: https://soorria.com/sitemap.xml\n',
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }
  )
