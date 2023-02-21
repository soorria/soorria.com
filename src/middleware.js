const BASE_URL = process.env.NODE_ENV === 'production' ? 'solid.soorria.com' : 'localhost:3000'

const linksPageSubdomain = new Set(['links', 'card', 'cardd', 'carrd'])

const next = () =>
  new Response(null, {
    headers: {
      'x-middleware-next': '1',
    },
  })

const rewrite = (/** @type {string} */ url) =>
  new Response(null, {
    headers: {
      'x-middlware-rewrite': url,
    },
  })

const middleware = async (/** @type {Request} */ req) => {
  const url = new URL(req.url)
  const { pathname } = url
  const host = req.headers.get('host')
  const isSubDomain = host?.includes(`.${BASE_URL}`)

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

  if (!isSubDomain && pathname.startsWith('/links')) {
    const dest = new URL(req.url)
    dest.pathname = '/404'
    return rewrite(dest)
  }

  const subdomain = host.replace(`.${BASE_URL}`, '')

  if (linksPageSubdomain.has(subdomain)) {
    const dest = new URL(req.url)
    dest.pathname = '/links'
    return rewrite(dest)
  }

  return next()
}

export default middleware
