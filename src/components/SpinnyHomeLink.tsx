import Router from 'next/router'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import random from '@/utils/random'
import Logo from './logo'

const MIN_ROTATION = 0
const MAX_ROTATION = 360 * 4
const START_ROTATION = MAX_ROTATION / 2

const RESET_TIMEOUT = 10000 // 10 seconds

const SpinnyHomeLink: React.FC = () => {
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
    <Link href="/">
      <a className="flex items-center group">
        <span
          className="w-6 h-6 transition-transform duration-700 ease-in-out sm:w-8 sm:h-8 md:w-10 md:h-10"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Logo />
        </span>
        <span className="ml-1.5 text-2xl font-bold lowercase sm:ml-3 sm:text-3xl font-display">
          Soorria<span className="hidden sm:inline"> Saruva</span>
        </span>
      </a>
    </Link>
  )
}

export default SpinnyHomeLink
