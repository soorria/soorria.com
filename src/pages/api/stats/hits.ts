import { getAllHits } from '@/lib/hits'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    res.json({ hits: await getAllHits() })
  }

  res.end()
}

export default handler
