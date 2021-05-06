import { ReactNode, useState } from 'react'

const CLASSNAMES = {
  heroCommon: 'hidden sm:block absolute inset-0 transform transition-transform select-none',
}

const Hero: React.FC<{ subtitle: ReactNode; now: ReactNode }> = ({ subtitle, now }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="px-4 pb-12 -mx-4 circuit-bg -mt-36 pt-36 lg:mx-[-4.5rem] lg:px-[4.5rem] xl:-mx-32 xl:px-32">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="py-16 mx-auto mt-8 mb-4 overflow-x-hidden text-5xl font-bold text-center outline-none cursor-default sm:text-6xl sm:my-8 md:text-7xl lg:text-8xl font-display group"
      >
        <div className="relative">
          <p
            aria-hidden
            className={`text-drac-pink ${CLASSNAMES.heroCommon} ${
              hovered ? '' : '-translate-x-4 -translate-y-4 md:-translate-x-8 md:-translate-y-8'
            }`}
          >
            Hey, I&apos;m Soorria
          </p>
          <p aria-hidden className="opacity-0 select-none">
            Hey, I&apos;m Soorria
          </p>
          <h1
            className={`absolute inset-0 duration-0 text-transparent bg-clip-text bg-gradient-to-tr from-drac-pink to-drac-purple sm:text-drac-fg ${
              hovered ? 'transition-opacity delay-100 sm:opacity-0' : ''
            }`}
          >
            Hey, I&apos;m Soorria
          </h1>
          <p
            aria-hidden
            className={`text-drac-purple ${CLASSNAMES.heroCommon} ${
              hovered ? '' : 'translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8'
            }`}
          >
            Hey, I&apos;m Soorria
          </p>
        </div>
      </div>
      <h2 className="mb-8 text-xl font-bold sm:text-2xl md:text-3xl sm:my-8 font-display">
        {subtitle}
      </h2>
      <div className="text-lg">{now}</div>
    </div>
  )
}

export default Hero
