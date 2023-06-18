import { baseComponents } from '~/components/mdx/base'
import { createMdxUtils } from '~/components/mdx/factory'

export const { Mdx, useMdxComponent, useMdxComponents } = createMdxUtils(baseComponents)
