import CustomLink from '../CustomLink'
import Demo from './Demo'
import TsJsSwitcher from './TsJsSwitcher'
import CustomCodeBlock from './CodeBlock'
import Sparkles from './Sparkles'
import type { ComponentMap } from 'mdx-bundler/client'

export const baseComponents = {
  a: CustomLink,
  pre: CustomCodeBlock,
  Demo,
  Sparkles,
  TsJsSwitcher,
} as ComponentMap
