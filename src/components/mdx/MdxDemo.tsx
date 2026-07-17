'use client'

import type { ComponentType } from 'react'
import { BubblingDemo } from '~data/blog/event-delegation/components'
import {
  InOrderExample,
  NaiveExample,
  WaitingForAllPromisesExample,
} from '~data/blog/promise-all/components'
import { createExample as createPreviousMemoExample } from '~data/snippets/create-previous-memo/components'
import { Example as FileDownloadExample } from '~data/snippets/file-download/components'
import { VanillaExample as SafeViewTransitionExample } from '~data/snippets/safe-view-transition/components'
import { Example as UseCssVarExample } from '~data/snippets/use-css-var-react/components'
import { Example as UseFullscreenExample } from '~data/snippets/use-fullscreen/components'
import { createExample as createMouseInactiveExample } from '~data/snippets/use-is-mouse-inactive-solid/components'
import { Example as UseLocalStorageExample } from '~data/snippets/use-local-storage/components'
import { Example as UseTemporaryStateExample } from '~data/snippets/use-temporary-state-react/components'
import ReactDemo from './ReactDemo.client'
import SolidDemo from './SolidDemo'

const demos = {
  'event-delegation': BubblingDemo,
  'promise-all-naive': NaiveExample,
  'promise-all-waiting': WaitingForAllPromisesExample,
  'promise-all-in-order': InOrderExample,
  'safe-view-transition': SafeViewTransitionExample,
  'use-temporary-state-react': UseTemporaryStateExample,
  'file-download': FileDownloadExample,
  'use-local-storage': UseLocalStorageExample,
  'use-css-var-react': UseCssVarExample,
  'use-fullscreen': UseFullscreenExample,
} satisfies Record<string, ComponentType>

const solidDemos = {
  'create-previous-memo': createPreviousMemoExample,
  'use-is-mouse-inactive-solid': createMouseInactiveExample,
}

export type MdxDemoId = keyof typeof demos

type MdxDemoProps =
  | { kind?: 'react'; id: keyof typeof demos; init?: 'lazy' | 'mount' | 'always' }
  | { kind: 'solid'; id: keyof typeof solidDemos; init?: 'lazy' | 'mount' | 'always' }

const MdxDemo = (props: MdxDemoProps) => {
  if (props.kind === 'solid') return <SolidDemo create={solidDemos[props.id]} />
  const { id, init = 'mount' } = props
  const Component = demos[id]
  return <ReactDemo content={<Component />} init={init} />
}

export default MdxDemo
