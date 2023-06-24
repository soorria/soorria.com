'use client'

import { minimalComponents } from '~/components/mdx/minimal'
import { createMdxUtils } from '../mdx/factory'

export const { Mdx, useMdxComponent, useMdxComponents } = createMdxUtils(minimalComponents)
