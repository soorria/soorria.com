import cx from '@/utils/cx'
import type { ReactNode } from 'react'

const classes = {
  secondary:
    'hidden sm:block absolute inset-0 select-none contrast-more:sm:hidden pointer-events-none',
  main: 'relative cursor-text inset-0 bg-gradient-to-tr from-drac-pink to-drac-purple bg-clip-text text-transparent sm:text-drac-fg contrast-more:sm:text-drac-pink',
}

const Hero: React.FC<{
  subtitle?: ReactNode | null
  title: ReactNode
  isStatic?: boolean
}> = ({ subtitle, title, children }) => {
  return (
    <div
      id="hero"
      className="circuit-bg -mx-4 -mt-36 px-4 pb-12 pt-36 md:-mx-8 md:px-8 lg:mx-[-4.5rem] lg:px-[4.5rem] xl:-mx-32 xl:px-32"
    >
      <div className="mx-auto my-4 cursor-default py-16 text-center font-display text-6xl font-bold leading-tight outline-none sm:my-8 sm:text-[4rem] md:text-[5rem] lg:text-8xl">
        <div className="relative">
          <p
            aria-hidden
            role="presentation"
            className={cx(
              `-translate-x-4 -translate-y-4 text-drac-pink sm:-translate-x-8 sm:-translate-y-8`,
              classes.secondary
            )}
          >
            {title}
          </p>
          <h1 className={classes.main}>{title}</h1>
          <p
            aria-hidden
            role="presentation"
            className={cx(
              `translate-x-4 translate-y-4 text-drac-purple sm:translate-x-8 sm:translate-y-8`,
              classes.secondary
            )}
          >
            {title}
          </p>
        </div>
      </div>
      {subtitle ? (
        <h2 className="mb-8 text-2xl sm:my-8 sm:text-2xl md:text-3xl">{subtitle}</h2>
      ) : null}
      {children}
    </div>
  )
}

export default Hero
