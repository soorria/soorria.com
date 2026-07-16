import { getFullMessage } from '~/lib/curl-card'
import { NextRequest } from 'next/server'

export const GET = (_req: NextRequest): Response => {
  return new Response(getFullMessage())
}
