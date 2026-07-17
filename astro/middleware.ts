import { defineMiddleware } from 'astro:middleware'

const linksSubdomains = new Set(['links', 'card', 'cardd', 'carrd'])

export const onRequest = defineMiddleware((context, next) => {
  if (context.isPrerendered) return next()

  const url = new URL(context.request.url)
  const pathname = url.pathname
  const userAgent = context.request.headers.get('user-agent') || ''

  if (pathname === '/' && !url.searchParams.has('card') && /^(curl|HTTPie)\//i.test(userAgent)) {
    return context.rewrite('/api/curl-card')
  }

  const excluded =
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/proxy') ||
    pathname.startsWith('/secrets')
  const hostname = (context.request.headers.get('host') || '').split(':')[0] ?? ''
  const suffix = '.soorria.com'

  if (
    !excluded &&
    hostname.endsWith(suffix) &&
    linksSubdomains.has(hostname.slice(0, -suffix.length))
  ) {
    return context.rewrite('/links')
  }

  return next()
})
