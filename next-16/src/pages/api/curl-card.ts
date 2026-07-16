import { NextRequest } from 'next/server'
import { getFullMessage } from '~/lib/curl-card'

export default (_req: NextRequest): Response => {
  return new Response(getFullMessage())
}
