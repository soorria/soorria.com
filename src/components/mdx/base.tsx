import CustomLink from '../CustomLink'
import TsJsSwitcher from './TsJsSwitcher'
import CustomCodeBlock from './CodeBlock'
import { ComponentProps, lazy } from 'solid-js'

export const baseComponents = {
  a: CustomLink,
  pre: CustomCodeBlock,
  Image: lazy(() => import('./MDXImage')),
  Sandbox: (props: ComponentProps<'iframe'>) => (
    <div class="-mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        {...props}
      />
    </div>
  ),
  Note: lazy(() => import('./Note')),
  Demo: () => <>TODO: react demo</>,
  SolidDemo: () => <>TODO: solid demo</>,
  Sparkles: lazy(() => import('./Sparkles')),
  TsJsSwitcher,
  Collapse: lazy(() => import('./MDXCollapse')),
}
