import { DataType } from '@/types/data'

const editUrl = (type: DataType, slug: string): string =>
  `https://github.com/mo0th/mooth.tech/edit/master/_data/${type}/${slug}.mdx`

export default editUrl
