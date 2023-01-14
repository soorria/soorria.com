import cx from '~/utils/cx'
import React, {
  ComponentType,
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import { RefreshIcon } from '../icons'
import { COMMON_CLASSNAMES, DEMO_CLASSNAMES } from './utils'
import autoAnimate from '@formkit/auto-animate'

export const DemoComponentWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const demoComponentWrapper = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrapper = demoComponentWrapper.current
    if (!wrapper) {
      return
    }

    const animation = autoAnimate(wrapper, (el, action) => {
      let keyframes: (Keyframe & CSSProperties)[] = []

      const scaleSmall = 'scale(0.9)'
      const scaleChangeOffset = 0.3
      if (action === 'remove') {
        keyframes = [
          { transform: `translate3d(0, 0, 0) scale(1)`, opacity: 1 },
          {
            transform: `translate3d(0, 0, 0) ${scaleSmall}`,
            opacity: 1,
            offset: scaleChangeOffset,
          },
          {
            transform: `translate3d(-100%, 0, 0) ${scaleSmall}`,
            opacity: 0,
            easing: 'linear',
            offset: 1 - scaleChangeOffset,
          },
          { transform: `translate3d(-100%, 0, 0) ${scaleSmall}`, opacity: 0, easing: 'linear' },
        ]
      } else if (action === 'add') {
        keyframes = [
          { transform: `translate3d(100%, 0, 0) ${scaleSmall}`, opacity: 0 },
          {
            transform: `translate3d(100%, 0, 0) ${scaleSmall}`,
            opacity: 0,
            offset: scaleChangeOffset,
          },
          { transform: `translate3d(0, 0, 0) ${scaleSmall}`, opacity: 1, easing: 'linear' },
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
        ]
      }

      return new KeyframeEffect(el, keyframes, { duration: 350 })
    })

    return () => {
      animation.disable()
    }
  }, [])

  return <div ref={demoComponentWrapper}>{children}</div>
}

interface ReactDemoProps {
  component: ComponentType
  init?: 'lazy' | 'mount' | 'always'
}

const ReactDemo: React.FC<ReactDemoProps> = ({ component: Component, init = 'mount' }) => {
  const [started, setStarted] = useState(init === 'always')
  const [key, setKey] = useState<number>(0)

  const initOnMount = init === 'mount'
  useEffect(() => {
    if (initOnMount) setStarted(true)
  }, [initOnMount])

  return (
    <div className={cx('demo-wrapper overflow-x-hidden', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      {started ? (
        <>
          <DemoComponentWrapper>
            <div key={key}>
              <Component />
            </div>
          </DemoComponentWrapper>
          <div className={DEMO_CLASSNAMES.footer}>
            <button onClick={() => setKey(p => p + 1)} className={DEMO_CLASSNAMES.reload}>
              <RefreshIcon
                className="mr-1 h-em w-em transition-transform duration-700"
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
              className="focus-ring block h-full w-full rounded bg-drac-base text-drac-pink transition hocus:text-drac-purple"
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
