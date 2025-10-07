import type { BaseFrontMatter, DataType } from '~/types/data'
import type { NextApiHandler, NextApiRequest } from 'next'
import { addCorsHeaders } from './cors'
import { getAllFilesFrontMatter, getFileWithContent } from './data'

const getQueryAsPositiveInteger = (req: NextApiRequest, param: string, def = 0): number => {
  const value = req.query[param]
  if (typeof value === 'string') {
    const asMaybeInt = parseInt(value)
    if (Number.isSafeInteger(asMaybeInt)) {
      return asMaybeInt >= 0 ? asMaybeInt : def
    }
  }
  return def
}

type PaginationOptions = {
  page: number
  size: number | null
}

const getPaginationOptions = (req: NextApiRequest): PaginationOptions => {
  return {
    page: getQueryAsPositiveInteger(req, '_page', 0),
    size: getQueryAsPositiveInteger(req, '_size', 0),
  }
}

interface GetAllOptions<T> {
  end?: boolean
  compareForSort?: (a: T, b: T) => number
}

export const createGetAllHandler =
  <T extends BaseFrontMatter>(
    type: DataType,
    { end = true, compareForSort }: GetAllOptions<T> = {}
  ): NextApiHandler =>
  async (req, res) => {
    if (req.method === 'GET') {
      addCorsHeaders(res)

      let frontMatters = await getAllFilesFrontMatter<T>(type)

      if (compareForSort) {
        frontMatters.sort(compareForSort)
      }

      const { page, size } = getPaginationOptions(req)

      if (size) {
        const offset = page * size
        frontMatters = frontMatters.slice(offset, offset + size)
      }

      if (req.query.content) {
        frontMatters = await Promise.all(
          frontMatters.map(f => getFileWithContent(type, f.slug) as unknown as T)
        )
      }

      frontMatters = frontMatters.map(f => ({ ...f, url: `https://soorria.com/${type}/${f.slug}` }))

      res.setHeader('Cache-Control', 'public, s-max-age=31536000')

      if (req.query.flat) {
        res.json(frontMatters)
      } else {
        res.json({ [type]: frontMatters })
      }
    }

    if (end) res.end()
  }

interface GetBySlugOptions {
  end?: boolean
}

export const createGetBySlugHandler =
  (type: DataType, { end = true }: GetBySlugOptions = {}): NextApiHandler =>
  async (req, res) => {
    if (req.method === 'GET') {
      addCorsHeaders(res)

      const slug = req.query.slug

      if (typeof slug !== 'string') {
        res.status(404).end()
        return
      }

      res.setHeader('Cache-Control', 'public, s-max-age=31536000')

      try {
        res.json({
          [type.endsWith('s') ? type.slice(0, type.length - 1) : type]: await getFileWithContent(
            type,
            slug
          ),
        })
      } catch {
        res.status(404).end()
      }
    }

    if (end) res.end()
  }
