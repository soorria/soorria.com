import { getFullMessage } from '~/lib/curl-card'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export const GET = (_req: NextRequest): Response => {
  return new Response(getFullMessage())
}
