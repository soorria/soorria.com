import { ComponentMap } from 'mdx-bundler/client'
import dynamic from 'next/dynamic'

export const minimalComponents = {
  Sparkles: dynamic(() => import('./Sparkles')),
} as ComponentMap
