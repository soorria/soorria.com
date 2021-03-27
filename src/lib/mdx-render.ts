import renderToString from 'next-mdx-remote/render-to-string'
import { MdxRemote } from 'next-mdx-remote/types'
import mdxPrism from 'mdx-prism'
import { components } from '@/components/MDXComponents'

export const render = async (source: string): Promise<MdxRemote.Source> => {
  return renderToString(source, {
    components,
    mdxOptions: {
      rehypePlugins: [mdxPrism],
    },
  })
}
