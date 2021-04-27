import { BaseFrontMatter, DataType } from '@/types/data'
import { NextApiHandler } from 'next'
import { addCorsHeaders } from './cors'
import { getAllFilesFrontMatter, getFileWithoutMdx } from './data'

interface GetAllOptions<T> {
  end?: boolean
  sort?: (a: T, b: T) => number
}

export const createGetAllHandler = <T extends BaseFrontMatter>(
  type: DataType,
  { end = true, sort }: GetAllOptions<T> = {}
): NextApiHandler => async (req, res) => {
  if (req.method === 'GET') {
    addCorsHeaders(res)

    const frontMatters = await getAllFilesFrontMatter<T>(type)

    if (sort) {
      frontMatters.sort(sort)
    }

    res.json({ [type]: frontMatters })
  }

  if (end) res.end()
}

interface GetBySlugOptions {
  end?: boolean
}

export const createGetBySlugHandler = (
  type: DataType,
  { end = true }: GetBySlugOptions = {}
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
