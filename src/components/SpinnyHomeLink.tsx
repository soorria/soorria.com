import Router from 'next/router'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import random from 'src/utils/random'
import Logo from './logo'

const MIN_ROTATION = 0
const MAX_ROTATION = 360 * 4

const RESET_TIMEOUT = 10000 // 10 seconds

const SpinnyHomeLink: React.FC = () => {
  const [rotation, setRotation] = useState(0)
  const resetTimout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleRouteChange = () => {
      setRotation(random(MIN_ROTATION, MAX_ROTATION))
      if (resetTimout.current) {
        clearTimeout(resetTimout.current)
      }
      resetTimout.current = setTimeout(() => {
        setRotation(0)
      }, RESET_TIMEOUT)
    }

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <Link href="/">
      <a className="flex items-center">
        <span
          className="w-6 h-6 transition-transform duration-700 ease-in-out sm:w-8 sm:h-8 md:w-10 md:h-10"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Logo />
        </span>
        <span className="ml-3 text-3xl font-bold lowercase font-display">
          Soorria<span className="hidden sm:inline"> Saruva</span>
        </span>
      </a>
    </Link>
  )
}

export default SpinnyHomeLink
