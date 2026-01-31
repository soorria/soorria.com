'use client'

import cx from '~/utils/cx'
import { Fragment, type ReactNode, useEffect, useState } from 'react'
import { RefreshIcon } from '../icons'

const COMMON_CLASSNAMES = {
  codeAndDemoRoot:
    'relative -mx-2 rounded-sm p-2 ring-2 ring-drac-purple md:-mx-6 md:py-4 md:px-6 bg-drac-base',
}

const DEMO_CLASSNAMES = {
  root: COMMON_CLASSNAMES.codeAndDemoRoot,
  reload:
    'focus-ring flex h-full w-full items-center justify-center rounded-sm bg-drac-base text-drac-pink transition hocus:bg-drac-base-dark hocus:text-drac-purple',
  footer: 'absolute inset-x-0 bottom-0 h-20 bg-drac-purple/50 p-4 md:px-6',
  spacing: 'h-24',
}

export type ReactDemoProps = {
  content: ReactNode
  init?: 'lazy' | 'mount' | 'always'
}

const ReactDemo = ({ content, init = 'mount' }: ReactDemoProps) => {
  const [started, setStarted] = useState(init === 'always')
  const [key, setKey] = useState<number>(0)

  const initOnMount = init === 'mount'
  useEffect(() => {
    if (initOnMount) setStarted(true)
  }, [initOnMount])

  return (
    <div className={cx('demo-wrapper', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      {started ? (
        <>
          <Fragment key={key}>{content}</Fragment>
          <div className={DEMO_CLASSNAMES.spacing} />
          <div className={DEMO_CLASSNAMES.footer}>
            <button onClick={() => setKey(p => p + 1)} className={DEMO_CLASSNAMES.reload}>
              <RefreshIcon
                className="mr-1 h-em w-em transition-transform duration-700 ease-out"
                style={{ transform: `rotate(-${key * 360}deg)` }}
              />{' '}
              Reload Demo
            </button>
          </div>
        </>
      ) : null}

      {!started ? (
        <>
          <div className="no-js-hidden h-20 bg-drac-purple/50 p-4 md:px-6">
            <button
              onClick={() => setStarted(true)}
              className="focus-ring block h-full w-full rounded-sm bg-drac-base text-drac-pink transition hocus:text-drac-purple"
            >
              Start Demo
            </button>
          </div>
          <noscript>
            <div className="grid h-full w-full place-items-center">
              Enable JavaScript to see this demo
            </div>
          </noscript>
        </>
      ) : null}
    </div>
  )
}

export default ReactDemo
