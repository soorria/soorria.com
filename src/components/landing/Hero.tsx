import { ReactNode } from 'react'

const CLASSNAMES = {
  heroCommon:
    'hidden sm:block absolute inset-0 transform motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0 transition-transform select-none',
}

const Hero: React.FC<{ subtitle?: ReactNode | null; now?: ReactNode | null }> = ({
  subtitle,
  now,
}) => {
  return (
    <div
      id="hero"
      className="px-4 pb-12 -mx-4 circuit-bg -mt-36 pt-36 lg:mx-[-4.5rem] lg:px-[4.5rem] xl:-mx-32 xl:px-32"
    >
      <div className="py-16 mx-auto mt-8 mb-4 overflow-x-hidden text-5xl font-bold text-center outline-none cursor-default group sm:text-6xl sm:my-8 md:text-7xl lg:text-8xl font-display">
        <div className="relative">
          <p
            aria-hidden
            className={`text-drac-pink ${CLASSNAMES.heroCommon} -translate-x-4 -translate-y-4 md:-translate-x-8 md:-translate-y-8`}
          >
            Hey, I&apos;m Soorria
          </p>
          <p aria-hidden className="opacity-0 select-none">
            Hey, I&apos;m Soorria
          </p>
          <h1 className="absolute inset-0 text-transparent transition-opacity duration-0 bg-clip-text bg-gradient-to-tr from-drac-pink to-drac-purple sm:text-drac-fg group-hover:delay-100 sm:motion-safe:group-hover:opacity-0">
            Hey, I&apos;m Soorria
          </h1>
          <p
            aria-hidden
            className={`text-drac-purple ${CLASSNAMES.heroCommon} translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8`}
          >
            Hey, I&apos;m Soorria
          </p>
        </div>
      </div>
      {subtitle ? (
        <h2 className="mb-8 text-xl font-bold sm:text-2xl md:text-3xl sm:my-8">{subtitle}</h2>
      ) : null}
      {now ? <div className="text-lg">{now}</div> : now}
    </div>
  )
}

export default Hero
