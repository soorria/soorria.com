import { useEffect, useRef, type ComponentType } from 'react'
import h from 'solid-js/h'
import { createComponent, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { render } from 'solid-js/web'

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
import ReactDemo, { type ReactDemoProps } from '~/components/mdx/ReactDemo.client'

const reactDemos = {
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

type MdxDemoIslandProps =
  | { kind: 'react'; id: keyof typeof reactDemos; init?: ReactDemoProps['init'] }
  | { kind: 'solid'; id: keyof typeof solidDemos; init?: ReactDemoProps['init'] }

export const MdxDemoIsland = (props: MdxDemoIslandProps) => {
  if (props.kind === 'solid') {
    return <AstroSolidDemo create={solidDemos[props.id]} />
  }

  const Component = reactDemos[props.id]
  return <ReactDemo content={<Component />} init={props.init ?? 'mount'} />
}

const AstroSolidDemo = ({ create }: { create: (typeof solidDemos)[keyof typeof solidDemos] }) => {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return

    const demo = create({ createEffect, createSignal, onMount, onCleanup, h })
    return render(() => createComponent(demo.component, {}), root.current!)
  }, [create])

  return <div ref={root} />
}
