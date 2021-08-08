import { GITHUB_URL } from '@/constants'
import { DataType } from '@/types/data'

const editUrl = (type: DataType, slug: string): string =>
  `${GITHUB_URL}/mooth.tech/edit/master/_data/${type}/${slug}.mdx`

export default editUrl
