import { BaseFrontMatter, DataType } from '@/types/data'
import { NextApiHandler } from 'next'
import { addCorsHeaders } from './cors'
import { getAllFilesFrontMatter, getFileWithContent } from './data'

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

      const frontMatters = await getAllFilesFrontMatter<T>(type)

      if (compareForSort) {
        frontMatters.sort(compareForSort)
      }

      res.setHeader('Cache-Control', 'public, s-max-age=31536000')

      res.json({ [type]: frontMatters })
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
      } catch (err) {
        res.status(404).end()
      }
    }

    if (end) res.end()
  }
