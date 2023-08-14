'use client'

import { useState, type ReactNode, useRef } from 'react'
import { MagicSprinkles } from './magic-sprinkles.component'
import { useHydrated } from '~/utils/use-hydrated'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import cx from '~/utils/cx'
import { random, shuffle } from '~/utils/random'
import { useFullscreen } from '~/utils/use-fullscreen'

const colors = shuffle([
  'text-drac-pink/25',
  'text-drac-green/25',
  'text-drac-cyan/25',
  'text-drac-purple/25',
  'text-drac-red/25',
]).map(color => ({
  color,
  x: random(-10, 10),
  y: random(-10, 10),
}))

const MagicSprinklesPage = ({ children }: { children: ReactNode }) => {
  const [showHeading, setShowHeading] = useState(true)
  const hydrated = useHydrated()
  const searchParams = useSearchParams()
  const quick = searchParams.has('quick-fade')
  const router = useRouter()
  const pathname = usePathname()
  const [fullscreenElement, fullscreenControls] = useFullscreen()

  const embed = searchParams.has('embed')

  const root = useRef<HTMLDivElement>(null)

  const classes = {
    button:
      'rounded px-2.5 py-1.5 font-display text-sm font-bold transition supports-hover:hover:bg-drac-base-dark/75 supports-hover:hover:text-drac-pink supports-hover:hover:underline contrast-more:bg-drac-base contrast-more:text-drac-pink supports-hover:contrast-more:hover:bg-drac-base-dark',
  }

  return (
    <div ref={root} className="relative min-h-[100lvh] overflow-x-hidden bg-drac-base">
      <MagicSprinkles />

      {hydrated && !embed && (
        <>
          {showHeading && (
            <>
              <div
                className="slide-in flex flex-col items-center gap-12 pt-16"
                style={
                  quick
                    ? { '--step-delay': '100ms' }
                    : { '--step-delay': '750ms', '--slide-duration': '1s' }
                }
                onAnimationEnd={() => {
                  if (!quick) {
                    const existingQuery = searchParams.toString()
                    const query = existingQuery
                      ? `${existingQuery}&quick-fade=true`
                      : 'quick-fade=true'
                    router.replace(`${pathname}?${query}`, { scroll: false })
                  }
                }}
              >
                <h1 className="relative isolate text-center font-display text-7xl font-bold">
                  magic sprinkles
                  {colors.map(({ color, x, y }, i) => (
                    <span
                      aria-hidden="true"
                      key={i}
                      className={cx(
                        'absolute left-1/2 top-1/2 -z-10 inline-block w-full -translate-x-1/2 -translate-y-1/2 scale-105 animate-pulse blur-md',
                        color
                      )}
                      style={{
                        animationDelay: `${i * 150}ms`,
                      }}
                    >
                      <span
                        className="inline-block"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        magic sprinkles
                      </span>
                    </span>
                  ))}
                </h1>

                <button
                  className={cx('bg-drac-base/50 text-drac-pink/75', classes.button)}
                  onClick={() => setShowHeading(false)}
                >
                  hide (most) text
                </button>
              </div>
            </>
          )}
          <div
            className="slide-in-direct fixed inset-x-0 bottom-16 flex justify-center"
            style={{ '--initial-step': '4' }}
          >
            <button
              className={cx(
                fullscreenElement === root.current
                  ? 'bg-drac-base/25 text-drac-pink/25'
                  : 'bg-drac-base/50 text-drac-pink/75',
                classes.button
              )}
              onClick={() => {
                if (root.current) {
                  fullscreenControls.toggle(root.current)
                }
              }}
            >
              toggle fullscreen
            </button>
          </div>
        </>
      )}

      {children}
    </div>
  )
}

export default MagicSprinklesPage
