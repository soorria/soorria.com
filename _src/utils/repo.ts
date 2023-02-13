import type { DataType } from '~/types/data'
import { GITHUB_URL } from '~/constants'

export const editUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/soorria.com/edit/main/_data/${type}/${slug}/index.mdx`

export const historyUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/soorria.com/commits/main/_data/${type}/${slug}/index.mdx`
