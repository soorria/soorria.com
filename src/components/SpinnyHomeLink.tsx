import Router from 'next/router'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { random } from '@/utils/random'
import Logo from './logo'
import cx from '@/utils/cx'

const MIN_ROTATION = 0
const MAX_ROTATION = 360 * 4
const START_ROTATION = MAX_ROTATION / 2

const RESET_TIMEOUT = 10000 // 10 seconds

const SpinnyHomeLink: React.FC<{ href?: string }> = ({ href = '/' }) => {
  const [rotation, setRotation] = useState(START_ROTATION)
  const resetTimout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleRouteChange = () => {
      setRotation(random(MIN_ROTATION, MAX_ROTATION))
      if (resetTimout.current) {
        clearTimeout(resetTimout.current)
      }
      resetTimout.current = setTimeout(() => {
        setRotation(START_ROTATION)
      }, RESET_TIMEOUT)
    }

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <Link href={href}>
      <a className="group z-10 flex items-center">
        <span
          className="h-6 w-6 transform transition-transform duration-700 ease-in-out sm:h-8 sm:w-8 md:h-10 md:w-10"
          style={{ '--tw-rotate': `${rotation}deg` } as any}
        >
          <Logo />
        </span>
        <span
          className={cx(
            'spinny-home-link ml-1.5 font-display text-2xl font-bold lowercase sm:ml-4 sm:text-3xl'
          )}
        >
          <span className="sr-only sm:not-sr-only">Soorria</span>
          <span className="sr-only md:not-sr-only"> Saruva</span>
        </span>
      </a>
    </Link>
  )
}

export default SpinnyHomeLink
