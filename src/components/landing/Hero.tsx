import { ReactNode, useMemo } from 'react'

interface HeroClassnames {
  common: string
  mainText: string
}

const useHeroClassnames = (isStatic: boolean): HeroClassnames => {
  return useMemo(() => {
    const classnames = {
      common: 'hidden sm:block absolute inset-0 select-none',
      mainText:
        'absolute inset-0 bg-gradient-to-tr from-drac-pink to-drac-purple bg-clip-text text-transparent sm:text-drac-fg ',
    }

    if (!isStatic) {
      classnames.common +=
        ' motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0 transition-transform '
      classnames.mainText +=
        ' duration-0 transition-opacity group-hover:delay-100 sm:motion-safe:group-hover:opacity-0'
    }

    return classnames
  }, [isStatic])
}

const Hero: React.FC<{
  subtitle?: ReactNode | null
  title: ReactNode
  isStatic?: boolean
}> = ({ subtitle, title, isStatic = false, children }) => {
  const classnames = useHeroClassnames(isStatic)

  return (
    <div
      id="hero"
      className="circuit-bg -mx-4 -mt-36 px-4 pb-12 pt-36 lg:mx-[-4.5rem] lg:px-[4.5rem] xl:-mx-32 xl:px-32"
    >
      <div className="group mx-auto mt-8 mb-4 cursor-default overflow-x-hidden py-16 text-center font-display text-5xl font-bold outline-none sm:my-8 sm:text-6xl md:text-7xl lg:text-8xl">
        <div className="relative">
          <p
            aria-hidden
            className={`text-drac-pink ${classnames.common} -translate-x-4 -translate-y-4 md:-translate-x-8 md:-translate-y-8`}
          >
            {title}
          </p>
          <p aria-hidden className="select-none opacity-0">
            {title}
          </p>
          <h1 className={classnames.mainText}>{title}</h1>
          <p
            aria-hidden
            className={`text-drac-purple ${classnames.common} translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8`}
          >
            {title}
          </p>
        </div>
      </div>
      {subtitle ? (
        <h2 className="mb-8 text-xl font-bold sm:my-8 sm:text-2xl md:text-3xl">{subtitle}</h2>
      ) : null}
      {children}
    </div>
  )
}

export default Hero
