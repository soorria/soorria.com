import { ComponentMap } from 'mdx-bundler/client'
import dynamic from 'next/dynamic'
import CustomLink from '../CustomLink'

export const minimalComponents = {
  Sparkles: dynamic(() => import('./Sparkles')),
  a: CustomLink,
} as ComponentMap
