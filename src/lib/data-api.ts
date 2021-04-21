import { DataType } from '@/types/data'
import { NextApiHandler } from 'next'
import { addCorsHeaders } from './cors'
import { getAllFilesFrontMatter, getFileWithoutMdx } from './data'

export const createGetAllHandler = (type: DataType, { end = true } = {}): NextApiHandler => async (
  req,
  res
) => {
  if (req.method === 'GET') {
    addCorsHeaders(res)
    res.json({ [type]: await getAllFilesFrontMatter(type) })
  }

  if (end) res.end()
}

export const createGetBySlugHandler = (
  type: DataType,
  { end = true } = {}
): NextApiHandler => async (req, res) => {
  if (req.method === 'GET') {
    addCorsHeaders(res)

    const slug = req.query.slug

    if (typeof slug !== 'string') {
      return res.status(404).end()
    }

    try {
      res.json({ [type.substr(0, type.length - 1)]: await getFileWithoutMdx(type, slug) })
    } catch (err) {
      return res.status(404).end()
    }
  }

  if (end) res.end()
}
