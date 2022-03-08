import cx from '@/utils/cx'
import { ComponentType, useState } from 'react'
import { RefreshIcon } from '../icons'
import { COMMON_CLASSNAMES } from './utils'

interface DemoWrapperProps {
  component: ComponentType
  lazy?: boolean
}

const DemoWrapper: React.FC<DemoWrapperProps> = ({ component: Component, lazy = false }) => {
  const [started, setStarted] = useState(!lazy)
  const [key, setKey] = useState<number>(0)

  return (
    <div className={cx('demo-wrapper', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      {started ? (
        <>
          <Component key={key} />
          <div className="h-24" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-drac-purple/50 p-4 md:px-6">
            <button
              onClick={() => setKey(p => p + 1)}
              className="flex h-full w-full items-center justify-center rounded bg-drac-bg text-drac-pink transition-colors hocus:text-drac-purple"
            >
              <RefreshIcon className="mr-1 h-em w-em" /> Reload Demo
            </button>
          </div>
        </>
      ) : null}

      {!started ? (
        <div className="h-20 bg-drac-purple/50 p-4 md:px-6">
          <button
            onClick={() => setStarted(true)}
            className="block h-full w-full rounded bg-drac-bg text-drac-pink transition-colors hocus:text-drac-purple"
          >
            Start Demo
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default DemoWrapper
