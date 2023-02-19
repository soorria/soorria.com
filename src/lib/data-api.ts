import { json } from 'solid-start'

import type { BaseData, DataType } from '~/types/data'

import { addCorsHeaders, corsHeaders } from './cors'
import { dataByType } from './data'

type ApiHandlerArgs = {
  request: Request
  locals: Record<string, any>
  params: Record<string, string | string[]>
  $type: '$FETCH'
  fetch: typeof fetch
}
type ApiHandler = (ctx: ApiHandlerArgs) => Promise<Response>

const getQueryAsPositiveInteger = (req: Request, param: string, def = 0): number => {
  const query = new URL(req.url)
  const value = query.searchParams.get(param)
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

const getPaginationOptions = (req: Request): PaginationOptions => {
  return {
    page: getQueryAsPositiveInteger(req, '_page', 0),
    size: getQueryAsPositiveInteger(req, '_size', 0),
  }
}

interface GetAllOptions<T> {
  compareForSort?: (a: T, b: T) => number
}

export const createGetAllHandler =
  <T extends BaseData>(type: DataType, { compareForSort }: GetAllOptions<T> = {}): ApiHandler =>
  async ({ request }) => {
    let frontMatters = dataByType[type].list

    if (compareForSort) {
      frontMatters.sort(compareForSort as GetAllOptions<BaseData>['compareForSort'])
    }

    const { page, size } = getPaginationOptions(request)

    if (size) {
      const offset = page * size
      frontMatters = frontMatters.slice(offset, offset + size)
    }

    return json(
      { [type]: frontMatters },
      {
        headers: {
          'Cache-Control': 'public, s-max-age=31536000',
          ...corsHeaders,
        },
      }
    )
  }

export const createGetBySlugHandler =
  (type: DataType): ApiHandler =>
  async ({ params }) => {
    const slug = params.slug
    const notFoundRes = json(
      {
        message: 'Not found',
      },
      { status: 404 }
    )

    let res

    if (typeof slug !== 'string') {
      res = notFoundRes
    } else {
      res = json(
        {
          [type.endsWith('s') ? type.slice(0, type.length - 1) : type]:
            dataByType[type].bySlug[slug] ?? null,
        },
        {
          headers: {
            'Cache-Control': 'public, s-max-age=31536000',
          },
        }
      )
    }

    addCorsHeaders(res)
    return res
  }
