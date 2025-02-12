import { cx } from '~/lib/utils/styles'
import type { PropsWithChildren, ReactNode } from 'react'
import type { LooseAutoComplete } from '~/lib/utils/types'
import { type Pattern, availablePatterns } from './hero-patterns'

const classes = {
  secondary:
    'hidden sm:block absolute inset-0 select-none contrast-more:sm:hidden pointer-events-none',
  main: 'relative cursor-text inset-0 bg-linear-to-tr from-drac-pink to-drac-purple bg-clip-text text-transparent sm:text-drac-content contrast-more:sm:text-drac-pink contrast-more:scale-110',
}

export const heroBackdropClassname =
  'relative pb-8 nmpt-36 nmpx-4 md:nmpx-8 lg:nmpx-20 xl:nmpx-52 2xl:nmpx-72'

const Hero = ({
  subtitle,
  title,
  children,
  pattern = 'circuit',
}: PropsWithChildren<{
  subtitle?: ReactNode | null
  title: ReactNode
  pattern?: LooseAutoComplete<Pattern>
}>) => {
  return (
    <div className="fade-in-direct">
      <div
        id="hero"
        className={cx('hero-bg slide-in overflow-hidden', heroBackdropClassname)}
        style={{
          '--pattern': availablePatterns[pattern] ?? availablePatterns.circuit ?? '',
        }}
      >
        {/* <div className="absolute inset-0 z-0 bg-red-200/70"></div> */}
        <div className="font-display relative z-10 mx-auto my-4 cursor-default py-16 text-center text-6xl leading-tight font-bold outline-hidden sm:my-8 sm:text-[4rem] md:text-[5rem] lg:text-8xl">
          <div className="slide-in relative" style={{ '--step-delay': '100ms' }}>
            <div className="absolute inset-0">
              <p
                aria-hidden
                role="presentation"
                className={cx(
                  `text-drac-pink -translate-x-4 -translate-y-4 sm:-translate-x-8 sm:-translate-y-8`,
                  classes.secondary,
                )}
              >
                {title}
              </p>
            </div>
            <div className="relative">
              <h1 className={classes.main}>{title}</h1>
            </div>
            <div className="absolute inset-0">
              <p
                aria-hidden
                role="presentation"
                className={cx(
                  `text-drac-purple z-20 translate-x-4 translate-y-4 sm:translate-x-8 sm:translate-y-8`,
                  classes.secondary,
                )}
              >
                {title}
              </p>
            </div>
          </div>
        </div>
        {subtitle ? (
          <h2 className="mb-8 text-2xl sm:my-8 sm:text-2xl md:text-3xl" id="hero-subtitle">
            {subtitle}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  )
}

export default Hero
