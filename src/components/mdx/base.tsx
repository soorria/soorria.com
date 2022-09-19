import CustomLink from '../CustomLink'
import Demo from './Demo'
import TsJsSwitcher from './TsJsSwitcher'
import CustomCodeBlock from './CodeBlock'
import Sparkles from './Sparkles'
import Image, { ImageProps } from 'next/future/image'
import type { ComponentMap } from 'mdx-bundler/client'

export const baseComponents = {
  a: CustomLink,
  pre: CustomCodeBlock,
  Image: (props: ImageProps) => (
    <div className="-mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...props} />
    </div>
  ),
  Demo,
  Sparkles,
  TsJsSwitcher,
} as ComponentMap
