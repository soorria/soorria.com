import type { DataType } from '~/types/data'
import { GITHUB_URL } from '~/constants'

export const sourceUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/soorria.com/blob/main/_data/${type}/${slug}/index.mdx?plain=1`

export const historyUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/soorria.com/commits/main/_data/${type}/${slug}/index.mdx`
