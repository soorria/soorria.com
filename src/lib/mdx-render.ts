import renderToString from 'next-mdx-remote/render-to-string'
import { MdxRemote } from 'next-mdx-remote/types'
import mdxPrism from 'mdx-prism'
import { baseComponents } from '@/components/mdx/base'

export const render = async (source: string): Promise<MdxRemote.Source> => {
  return renderToString(source, {
    components: baseComponents,
    mdxOptions: {
      rehypePlugins: [mdxPrism],
    },
  })
}
