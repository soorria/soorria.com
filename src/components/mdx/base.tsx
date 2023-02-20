import { ComponentProps, lazy, ValidComponent, VoidComponent } from 'solid-js'

import CustomLink from '../CustomLink'
import CustomCodeBlock from './CodeBlock'
import TsJsSwitcher from './TsJsSwitcher'

export type RenderedMdxComponent = VoidComponent<{ components: Record<string, ValidComponent> }>

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
  Demo: lazy(() => import('./ReactDemo')),
  SolidDemo: () => <>TODO: solid demo</>,
  Sparkles: lazy(() => import('./Sparkles')),
  TsJsSwitcher,
  Collapse: lazy(() => import('./MDXCollapse')),
}
