import type { NextApiRequest, NextApiResponse } from 'next'
import { getFullMessage } from '~/lib/curl-card'

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.status(200).send(getFullMessage())
}
