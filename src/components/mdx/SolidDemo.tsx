// import { type HyperScript } from 'hyper-dom-expressions'
import {
  Component,
  createComponent,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  VoidComponent,
} from 'solid-js'
import h from 'solid-js/h'
import { render } from 'solid-js/web'

import cx from '~/utils/cx'
import { useHydrated } from '~/utils/use-hydrated'

import { RefreshIcon } from '../icons'
import { CODE_BLOCK_CLASSNAMES, DEMO_CLASSNAMES } from './utils'

type SolidStuff = {
  createSignal: typeof createSignal
  createEffect: typeof createEffect
  onMount: typeof onMount
  onCleanup: typeof onCleanup
  // h: HyperScript
  h: () => HTMLElement
}

export type CreateSolidDemo = (stuff: SolidStuff) => { component: Component }

interface SolidDemoProps {
  create: CreateSolidDemo
}

const SolidDemo: VoidComponent<SolidDemoProps> = props => {
  const hydrated = useHydrated()

  const [key, setKey] = createSignal<number>(0)
  let solidRoot: HTMLDivElement | undefined
  const createSolidDemo = props.create

  createEffect(() => {
    const root = solidRoot
    if (!root || !hydrated) return

    const demo = createSolidDemo({
      createEffect,
      createSignal,
      onMount,
      onCleanup,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      h,
    })

    const unmount = render(() => createComponent(demo.component, {}), root)

    onCleanup(() => {
      root.innerHTML = ''
      unmount()
    })
  })

  return (
    <div class={cx('demo-wrapper', DEMO_CLASSNAMES.root)}>
      <div class={CODE_BLOCK_CLASSNAMES.header}>
        <div class={CODE_BLOCK_CLASSNAMES.languageTitle}>Contains real Solid!!</div>
      </div>
      <div ref={solidRoot} />
      <div class={DEMO_CLASSNAMES.spacing} />
      <div class={DEMO_CLASSNAMES.footer}>
        <button onClick={() => setKey(p => p + 1)} class={DEMO_CLASSNAMES.reload}>
          <RefreshIcon
            class="mr-1 h-em w-em transition-transform duration-700"
            style={{ transform: `rotate(-${key() * 360}deg)` }}
          />{' '}
          Reload Demo
        </button>
      </div>
    </div>
  )
}

export default SolidDemo
