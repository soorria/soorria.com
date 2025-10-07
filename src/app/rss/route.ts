import { createFeed } from '~/lib/data'

export const dynamic = 'force-static'

export async function GET() {
  const feed = await createFeed()
  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
