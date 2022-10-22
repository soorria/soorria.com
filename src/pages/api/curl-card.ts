import { getFullMessage } from '~/lib/curl-card'
import type { PageConfig } from 'next'
import type { NextRequest } from 'next/server'

export const config: PageConfig = {
  runtime: 'experimental-edge',
}

const handler = (_req: NextRequest): Response => {
  return new Response(getFullMessage(), {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}

export default handler
