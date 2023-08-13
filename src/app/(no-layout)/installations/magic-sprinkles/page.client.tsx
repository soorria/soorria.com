'use client'

import { useState, type ReactNode } from 'react'
import { MagicSprinkles } from './magic-sprinkles.component'
import { useHydrated } from '~/utils/use-hydrated'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import cx from '~/utils/cx'
import { random, shuffle } from '~/utils/random'

// export const metadata = {
//   title: 'Magic Sprinkles',
//   description: 'A fun and addictive little interactive animation',
// }

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

  return (
    <div className="relative min-h-screen">
      <MagicSprinkles />

      {hydrated && (
        <>
          {showHeading && (
            <div
              className="slide-in flex flex-col items-center gap-12 pt-16"
              style={
                quick
                  ? { '--step-delay': '100ms' }
                  : { '--step-delay': '750ms', '--slide-duration': '1s' }
              }
              onAnimationEnd={() => {
                if (!quick) {
                  router.replace(`${pathname}?quick-fade=true`, { scroll: false })
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
                className="rounded bg-drac-base/50 px-2 py-1 font-display text-sm font-bold text-drac-pink/75 transition hover:bg-drac-base-dark/75 hover:text-drac-pink hover:underline contrast-more:bg-drac-base contrast-more:text-drac-pink contrast-more:hover:bg-drac-base-dark"
                onClick={() => setShowHeading(false)}
              >
                hide this heading
              </button>
            </div>
          )}

          {children}
        </>
      )}
    </div>
  )
}

export default MagicSprinklesPage
