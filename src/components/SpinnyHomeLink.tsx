'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { random } from '~/utils/random'
import Logo from './logo'
import cx from '~/utils/cx'

const MIN_ROTATION = 0
const MAX_ROTATION = 360 * 4
const START_ROTATION = MAX_ROTATION / 2

const RESET_TIMEOUT = 10000 // 10 seconds

const SpinnyHomeLink: React.FC<{ href?: string }> = ({ href = '/' }) => {
  const [rotation, setRotation] = useState(START_ROTATION)
  const resetTimout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const spin = useCallback(() => {
    setRotation(random(MIN_ROTATION, MAX_ROTATION))
    if (resetTimout.current) {
      clearTimeout(resetTimout.current)
    }
    resetTimout.current = setTimeout(() => {
      setRotation(START_ROTATION)
    }, RESET_TIMEOUT)
  }, [])

  const pathname = usePathname()

  useEffect(() => {
    spin()
  }, [pathname, spin])

  return (
    <Link
      href={href}
      onClick={() => {
        if (pathname === '/') {
          spin()
        }
      }}
      className="focus-ring group z-10 -m-2 flex items-center rounded p-2"
    >
      <span
        className="h-8 w-8 transform transition-transform duration-700 ease-in-out md:h-10 md:w-10"
        style={{ '--tw-rotate': `${rotation}deg` }}
      >
        <Logo />
      </span>
      <span
        className={cx(
          'logo-link-text font-display text-2xl font-bold lowercase sm:ml-4 sm:text-3xl'
        )}
      >
        <span className="sr-only sm:not-sr-only">Soorria</span>
        {/* <span className="sr-only lg:not-sr-only">moorthy</span> */}
        <span className="sr-only md:not-sr-only"> Saruva</span>
      </span>
    </Link>
  )
}

export default SpinnyHomeLink
