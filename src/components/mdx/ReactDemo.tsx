import { createSignal, onMount, ValidComponent, VoidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import cx from '~/utils/cx'

import { RefreshIcon } from '../icons'
import { COMMON_CLASSNAMES, DEMO_CLASSNAMES } from './utils'

interface ReactDemoProps {
  component: ValidComponent
  init?: 'mount' | 'always'
}

const ReactDemo: VoidComponent<ReactDemoProps> = props => {
  const [started, setStarted] = createSignal(props.init === 'always')
  const [key, setKey] = createSignal<number>(0)

  const initOnMount = props.init === 'mount'
  if (initOnMount) {
    onMount(() => {
      setStarted(true)
    })
  }

  return (
    <div class={cx('demo-wrapper', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      {started() ? (
        <>
          <Dynamic component={props.component} />
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
        </>
      ) : null}

      {!started ? (
        <>
          <div class="no-js-hidden h-20 bg-drac-purple/50 p-4 md:px-6">
            <button
              onClick={() => setStarted(true)}
              class="focus-ring block h-full w-full rounded bg-drac-base text-drac-pink transition hocus:text-drac-purple"
            >
              Start Demo
            </button>
          </div>
          <noscript>
            <div class="grid h-full w-full place-items-center">
              Enable JavaScript to see this demo
            </div>
          </noscript>
        </>
      ) : null}
    </div>
  )
}

export default ReactDemo
