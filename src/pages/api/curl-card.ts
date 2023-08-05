import { type PageConfig } from 'next'
import { NextRequest } from 'next/server'
import { getFullMessage } from '~/lib/curl-card'

export const config: PageConfig = {
  runtime: 'edge',
}

export default (_req: NextRequest): Response => {
  return new Response(getFullMessage())
}
