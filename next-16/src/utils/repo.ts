import type { DataType } from '~/types/data'
import { GITHUB_URL } from '~/constants'

export const sourceUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/soorria.com/blob/main/src/data/${type}/${slug}/index.mdx?plain=1`
