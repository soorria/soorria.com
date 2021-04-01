import Container from '@/components/Container'
import { useState } from 'react'

const CLASSNAMES = {
  heroCommon: 'hidden sm:block absolute inset-0 transform transition-transform select-none',
}

const Hero: React.FC = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="py-16 my-8 overflow-x-hidden text-5xl font-bold text-center outline-none cursor-default md:text-7xl lg:text-8xl font-display group"
    >
      <div className="relative">
        <p
          className={`text-drac-pink ${CLASSNAMES.heroCommon} ${
            hovered ? '' : '-translate-x-4 -translate-y-4 md:-translate-x-8 md:-translate-y-8'
          }`}
        >
          Hey, I&apos;m Soorria
        </p>
        <p className="opacity-0 select-none">Hey, I&apos;m Soorria</p>
        <h1
          className={`absolute inset-0 duration-0 ${
            hovered ? 'transition-opacity delay-100 sm:opacity-0' : ''
          }`}
        >
          Hey, I&apos;m Soorria
        </h1>
        <p
          className={`text-drac-purple ${CLASSNAMES.heroCommon} ${
            hovered ? '' : 'translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8'
          }`}
        >
          Hey, I&apos;m Soorria
        </p>
      </div>
    </div>
  )
}

const IndexPage: React.FC = () => {
  return (
    <Container>
      <Hero />
    </Container>
  )
}

export default IndexPage
