import { MDXRemote } from 'next-mdx-remote/rsc'
import { type DataType } from '~/types/data'
import { dataComponents } from './data-components.generated'
import { baseComponents } from './base'
import { getMdxOptions } from '~/lib/mdx.server'

type MdxRendererProps = {
  code: string
  type?: DataType
  slug?: string
  hasCodeBlocks?: boolean
}

const MdxRenderer = async (props: MdxRendererProps) => {
  const { code, type, slug } = props

  const key = type && slug ? `${type}/${slug}` : undefined
  const componentsForData = key ? dataComponents[key as keyof typeof dataComponents] : {}

  const allComponents = { ...baseComponents, ...componentsForData }

  return (
    <MDXRemote
      source={code}
      components={allComponents}
      options={{
        scope: { ...componentsForData },
        mdxOptions: {
          ...getMdxOptions({ hasCodeBlocks: props.hasCodeBlocks ?? true }),
        },
      }}
    />
  )
}

export default MdxRenderer
