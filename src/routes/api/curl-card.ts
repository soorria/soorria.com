import { getFullMessage } from '~/lib/curl-card'

export const GET = (): Response => {
  return new Response(getFullMessage(), {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
