import { PUBLIC_URL } from '@/constants'
import { NextMiddleware, NextResponse } from 'next/server'

const BASE_URL = process.env.NODE_ENV === 'production' ? PUBLIC_URL : 'localhost:3000'

const linksPageSubdomain = new Set(['links', 'card', 'cardd'])

const middleware: NextMiddleware = async req => {
  const { pathname } = req.nextUrl
  const host = req.headers.get('host')
  const isSubDomain = host?.includes(`.${BASE_URL}`)

  if (pathname.includes('.') || pathname.startsWith('/api') || !host || !isSubDomain) {
    return NextResponse.next()
  }

  const subdomain = host.replace(`.${BASE_URL}`, '')

  if (linksPageSubdomain.has(subdomain)) {
    const dest = req.nextUrl.clone()
    dest.pathname = '/links'
    return NextResponse.rewrite(dest)
  }

  return NextResponse.next()
}

export default middleware
