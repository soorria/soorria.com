import { getHits, getHitsByCategory, trackHit } from '@/lib/hits'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { category, slug } = req.query

    if (typeof category !== 'string' || typeof slug !== 'string') {
      return res.status(406).end()
    }
    await getHitsByCategory('test')

    const hits = await getHits(category, slug)

    return res.json({ hits })
  }

  if (req.method === 'POST') {
    const { category, slug } = req.body

    if (typeof category !== 'string' || typeof slug !== 'string') {
      return res.status(406).end()
    }

    if (!req.preview) {
      await trackHit(category, slug)
    }

    return res.status(204).end()
  }

  res.end()
}

export default handler
