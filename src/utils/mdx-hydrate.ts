import { MdxRemote } from 'next-mdx-remote/types'
import { ReactNode } from 'react'
import mdxHydrate from 'next-mdx-remote/hydrate'
import { components } from 'src/components/MDXComponents'

export const hydrate = (source: MdxRemote.Source): ReactNode => {
  return mdxHydrate(source, { components })
}
