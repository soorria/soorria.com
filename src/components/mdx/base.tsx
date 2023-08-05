import CustomLink from '../CustomLink'
import ReactDemo from './ReactDemo'
import TsJsSwitcher from './TsJsSwitcher'
import CodeBlock from './CodeBlock'
import dynamic from 'next/dynamic'
import { OnlyIsTs, TsJsToggle } from '../TsJsToggle'
import type { MDXRemoteProps } from 'next-mdx-remote'

const Sparkles = dynamic(() => import('./Sparkles'))

export const baseComponents = {
  a: CustomLink,
  pre: CodeBlock,
  Image: dynamic(() => import('./MDXImage')),
  Sandbox: props => (
    <div className="-mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        loading="lazy"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        {...props}
      />
    </div>
  ),
  Note: dynamic(() => import('./Note')),
  Demo: ReactDemo,
  SolidDemo: dynamic(() => import('./SolidDemo'), { ssr: false }),
  Sparkles,
  sparkles: Sparkles,
  's-sparkles': Sparkles,
  TsJsSwitcher,
  TsJsToggle,
  OnlyIsTs: OnlyIsTs,
  Collapse: dynamic(() => import('./MDXCollapse')),
} as MDXRemoteProps['components']
