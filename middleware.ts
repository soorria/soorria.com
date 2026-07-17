import { next, rewrite } from '@vercel/functions'
import { getFullMessage } from './src/lib/curl-card'

const linksSubdomains = new Set(['links', 'card', 'cardd', 'carrd'])
export default function middleware(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const host = request.headers.get('host') || ''
  const userAgent = request.headers.get('user-agent') || ''

  if (pathname === '/' && !url.searchParams.has('card') && /^(curl|HTTPie)\//i.test(userAgent)) {
    return new Response(getFullMessage(), {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Type': 'text/plain; charset=utf-8',
        Vary: 'User-Agent',
      },
    })
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
