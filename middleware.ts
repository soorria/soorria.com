import { next, rewrite } from '@vercel/functions'

const linksSubdomains = new Set(['links', 'card', 'cardd', 'carrd'])
export default function middleware(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const host = request.headers.get('host') || ''
  const userAgent = request.headers.get('user-agent') || ''

  if (pathname === '/' && !url.searchParams.has('card') && /^(curl|HTTPie)\//i.test(userAgent)) {
    return rewrite(new URL('/api/curl-card', url))
  }

  const excluded =
    pathname === '/links' ||
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/proxy') ||
    pathname.startsWith('/secrets')
  const hostname = host.split(':')[0] ?? ''
  const suffix = '.soorria.com'
  if (
    !excluded &&
    hostname.endsWith(suffix) &&
    linksSubdomains.has(hostname.slice(0, -suffix.length))
  ) {
    return rewrite(new URL('/links', url))
  }

  return next()
}
