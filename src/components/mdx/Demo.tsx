import cx from '@/utils/cx'
import { ComponentType, useEffect, useState } from 'react'
import { RefreshIcon } from '../icons'
import { COMMON_CLASSNAMES } from './utils'

interface DemoWrapperProps {
  component: ComponentType
  init?: 'lazy' | 'mount' | 'always'
}

const DemoWrapper: React.FC<DemoWrapperProps> = ({ component: Component, init = 'mount' }) => {
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
          <Component key={key} />
          <div className="h-24" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-drac-purple/50 p-4 md:px-6">
            <button
              onClick={() => setKey(p => p + 1)}
              className="focus-ring flex h-full w-full items-center justify-center rounded bg-drac-bg text-drac-pink transition hocus:text-drac-purple"
            >
              <RefreshIcon className="mr-1 h-em w-em" /> Reload Demo
            </button>
          </div>
        </>
      ) : null}

      {!started ? (
        <>
          <div className="no-js-hidden h-20 bg-drac-purple/50 p-4 md:px-6">
            <button
              onClick={() => setStarted(true)}
              className="focus-ring block h-full w-full rounded bg-drac-bg text-drac-pink transition hocus:text-drac-purple"
            >
              Start Demo
            </button>
          </div>
          <noscript>
            <div className="grid h-full w-full place-items-center">
              Enable JavaScript to see this demo
            </div>
            <style>{'.no-js-hidden{display:none}'}</style>
          </noscript>
        </>
      ) : null}
    </div>
  )
}

export default DemoWrapper
