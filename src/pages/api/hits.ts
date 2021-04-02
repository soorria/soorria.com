import { getDetaDb } from '@/lib/deta'
import { NextApiHandler } from 'next'

const getHitsDb = () => getDetaDb(process.env.NODE_ENV === 'production' ? 'hits' : 'hits-dev')

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { category, slug } = req.query

    if (typeof category !== 'string' || typeof slug !== 'string') {
      res.status(406).end()
    }

    const db = getHitsDb()
    const response: any = await db.get(`${category}/${slug}`)
    const hits = response?.hits ?? 0

    return res.json({ hits })
  }

  if (req.method === 'POST') {
    const { category, slug } = req.body

    if (typeof category !== 'string' || typeof slug !== 'string') {
      res.status(406).end()
    }

    const db = getHitsDb()
    const key = `${category}/${slug}`
    try {
      await db.update({ hits: db.util.increment(1) }, key)
    } catch (err) {
      await db.insert({ hits: 1, category, slug }, key)
    }
    return res.status(204).end()
  }

  res.end()
}

export default handler
