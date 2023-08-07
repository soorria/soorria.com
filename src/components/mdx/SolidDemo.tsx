'use client'

import { type HyperScript } from 'hyper-dom-expressions'
import { useEffect, useRef, useState } from 'react'

import cx from '~/utils/cx'
import { useHydrated } from '~/utils/use-hydrated'
import { RefreshIcon } from '../icons'
import { CODE_BLOCK_CLASSNAMES, DEMO_CLASSNAMES } from './utils'

type SolidJS = typeof import('solid-js')

type SolidStuff = {
  createSignal: SolidJS['createSignal']
  createEffect: SolidJS['createEffect']
  onMount: SolidJS['onMount']
  onCleanup: SolidJS['onCleanup']
  h: HyperScript
}

export type CreateSolidDemo = (stuff: SolidStuff) => {
  component: import('solid-js').Component | (() => ReturnType<HyperScript>)
}

interface SolidDemoProps {
  create: CreateSolidDemo
}

const SolidDemo: React.FC<SolidDemoProps> = props => {
  const hydrated = useHydrated()

  const [key, setKey] = useState<number>(0)
  const solidRoot = useRef<HTMLDivElement>(null)
  const createSolidDemo = props.create

  useEffect(() => {
    const root = solidRoot.current
    if (!root || !hydrated) return

    let shouldRender = true
    let unmount: () => void = () => {
      /**/
    }

    const go = async () => {
      /**
       * The things you do for love...
       *
       * The following code is a workaround for Webpack trying to handle dynamic imports.
       */
      /* eslint-disable */
      const { createEffect, createSignal, onMount, onCleanup, createComponent } = await eval(
        "import('https://esm.sh/solid-js@1.7.8')"
      )
      const { render } = await eval("import('https://esm.sh/solid-js@1.7.8/web')")
      const { default: h } = await eval("import('https://esm.sh/solid-js@1.7.8/h')")
      const demo = createSolidDemo({
        createEffect,
        createSignal,
        onMount,
        onCleanup,
        h,
      })
      if (shouldRender) {
        unmount = render(() => createComponent(demo.component, {}), root)
      }
      /* eslint-enable */
    }

    go()

    return () => {
      root.innerHTML = ''
      unmount()
      shouldRender = false
    }
  }, [key, hydrated, createSolidDemo])

  return (
    <div className={cx('demo-wrapper', DEMO_CLASSNAMES.root)}>
      <div className={CODE_BLOCK_CLASSNAMES.header}>
        <div className={CODE_BLOCK_CLASSNAMES.languageTitle}>Contains real Solid!!</div>
      </div>
      <div ref={solidRoot}></div>
      <div className={DEMO_CLASSNAMES.spacing} />
      <div className={DEMO_CLASSNAMES.footer}>
        <button onClick={() => setKey(p => p + 1)} className={DEMO_CLASSNAMES.reload}>
          <RefreshIcon
            className="mr-1 h-em w-em transition-transform duration-700"
            style={{ transform: `rotate(-${key * 360}deg)` }}
          />{' '}
          Reload Demo
        </button>
      </div>

      {/* <div className="absolute inset-0 grid place-items-center rounded bg-drac-base-dark/80 backdrop-blur">
        <span className="inline-block max-w-md px-4 text-center text-balance">
          🚧
          <br />
          Solid.js demos are broken since I migrated to Next.js 13&apos;s app directory & server
          components
        </span>
      </div> */}
    </div>
  )
}

export default SolidDemo
