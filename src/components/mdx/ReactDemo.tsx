import { createSignal, ValidComponent, VoidComponent } from 'solid-js'

import cx from '~/utils/cx'
import { useHydrated } from '~/utils/use-hydrated'

import { RefreshIcon } from '../icons'
import { COMMON_CLASSNAMES, DEMO_CLASSNAMES } from './utils'

interface ReactDemoProps {
  component: ValidComponent
}

const ReactDemo: VoidComponent<ReactDemoProps> = props => {
  // const [started, setStarted] = createSignal(init === 'always')
  const [key, setKey] = createSignal<number>(0)
  const hydrated = useHydrated()

  return (
    <div class={cx('demo-wrapper', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      {hydrated() ? (
        <>
          {/* <Dynamic component={props.component} /> */}
          <div class={DEMO_CLASSNAMES.spacing} />
          <div class={DEMO_CLASSNAMES.footer}>
            <button onClick={() => setKey(p => p + 1)} class={DEMO_CLASSNAMES.reload}>
              <RefreshIcon
                class="mr-1 h-em w-em transition-transform duration-700 ease-out"
                style={{ transform: `rotate(-${key() * 360}deg)` }}
              />{' '}
              Reload Demo
            </button>
          </div>
        </>
      ) : null}

      <noscript>
        <div class="grid h-full w-full place-items-center">Enable JavaScript to see this demo</div>
      </noscript>

      {/* {!hydrated() ? (
        <>
          <div class="no-js-hidden h-20 bg-drac-purple/50 p-4 md:px-6">
            <button
              class="focus-ring block h-full w-full rounded bg-drac-base text-drac-pink transition hocus:text-drac-purple"
            >
              Start Demo
            </button>
          </div>
        </>
      ) : null} */}
    </div>
  )
}

export default ReactDemo
