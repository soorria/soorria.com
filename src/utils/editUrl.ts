import type { DataType } from '@/types/data'
import { GITHUB_URL } from '@/constants'

const editUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/mooth.tech/edit/master/_data/${type}/${slug}.mdx`

export default editUrl
