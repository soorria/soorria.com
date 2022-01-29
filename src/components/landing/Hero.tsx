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
      className="circuit-bg -mx-4 -mt-36 px-4 pb-12 pt-36 lg:mx-[-4.5rem] lg:px-[4.5rem] xl:-mx-32 xl:px-32"
    >
      <div className="outline-none group mx-auto mt-8 mb-4 cursor-default overflow-x-hidden py-16 text-center font-display text-5xl font-bold sm:my-8 sm:text-6xl md:text-7xl lg:text-8xl">
        <div className="relative">
          <p
            aria-hidden
            className={`text-drac-pink ${CLASSNAMES.heroCommon} -translate-x-4 -translate-y-4 md:-translate-x-8 md:-translate-y-8`}
          >
            Hey, I&apos;m Soorria
          </p>
          <p aria-hidden className="select-none opacity-0">
            Hey, I&apos;m Soorria
          </p>
          <h1 className="duration-0 absolute inset-0 bg-gradient-to-tr from-drac-pink to-drac-purple bg-clip-text text-transparent transition-opacity group-hover:delay-100 sm:text-drac-fg sm:motion-safe:group-hover:opacity-0">
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
        <h2 className="mb-8 text-xl font-bold sm:my-8 sm:text-2xl md:text-3xl">{subtitle}</h2>
      ) : null}
      {now ? <div className="text-lg">{now}</div> : now}
    </div>
  )
}

export default Hero
