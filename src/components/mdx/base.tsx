import CustomLink from '../CustomLink'
import Demo from './Demo'
import TsJsSwitcher from './TsJsSwitcher'
import CustomCodeBlock from './CodeBlock'
import Note from './Note'
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
  Sandbox: props => (
    <div className="-mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        {...props}
      />
    </div>
  ),
  Note,
  Demo,
  Sparkles,
  TsJsSwitcher,
} as ComponentMap
