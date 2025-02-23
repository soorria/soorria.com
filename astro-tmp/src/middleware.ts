import { defineMiddleware } from 'astro:middleware'

const BASE_URL = process.env.NODE_ENV === 'production' ? 'soorria.com' : 'localhost:4321'

const linksPageSubdomain = new Set(['links', 'card', 'cardd', 'carrd'])

export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.originPathname
  const host = new URL(context.request.url).host
  const isSubDomain = host?.includes(`.${BASE_URL}`)
  const subdomain = host?.replace(`.${BASE_URL}`, '')

  const dest = new URL(context.request.url.replace(`${subdomain}.`, ''))
  dest.pathname = '/links'

  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/proxy') ||
    pathname.startsWith('/secrets') ||
    !host ||
    !isSubDomain
  ) {
    return next()
  }

  if (linksPageSubdomain.has(subdomain)) {
    return context.rewrite(dest.toString())
  }

  return next()
})
