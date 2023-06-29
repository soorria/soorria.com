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

export type CreateSolidDemo = (stuff: SolidStuff) => { component: import('solid-js').Component }

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

    const unmount: () => void = () => {
      /**/
    }

    const go = async () => {
      // const { createEffect, createSignal, onMount, onCleanup, createComponent } = await import(
      //   'solid-js'
      // )
      // const { render } = await import('solid-js/web')
      // const { default: h } = await import('solid-js/h')
      // const demo = createSolidDemo({
      //   createEffect,
      //   createSignal,
      //   onMount,
      //   onCleanup,
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   h,
      // })
      // unmount = render(() => createComponent(demo.component, {}), root)
    }

    go()

    return () => {
      root.innerHTML = ''
      unmount()
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
    </div>
  )
}

export default SolidDemo
