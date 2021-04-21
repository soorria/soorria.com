import { NextApiResponse } from 'next'

export const addCorsHeaders = (res: NextApiResponse): void => {
  res.setHeader('Access-Control-Allow-Origin', '*')
}
