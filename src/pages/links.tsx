import Container from '@/components/Container'
import {
  IconComponent,
  JavascriptIcon,
  MiscCodeIcon,
  ReactIcon,
  ScriptIcon,
  TypescriptIcon,
} from '@/components/icons'
import Hero from '@/components/landing/Hero'
import MadeBy from '@/components/MadeBy'
import { links } from '@/links'
import cx from '@/utils/cx'
import { GetStaticProps } from 'next'
import { useEffect } from 'react'

const classes = {
  anchor: cx(
    'group flex items-center justify-between rounded-lg bg-drac-bg/70 py-6 px-8 text-drac-pink transition',
    'hocus:bg-drac-bg hocus:text-drac-purple',
    'focus:outline-none focus:ring focus:ring-drac-purple'
  ),
}

const floaterComponents: [IconComponent, number][] = [
  [JavascriptIcon, 2],
  [ReactIcon, 3],
  [TypescriptIcon, 2],
  [ScriptIcon, 1],
  [MiscCodeIcon, 2],
]

const useCSSVarScrollRotate = (varName = 'scroll-rotate') => {
  useEffect(() => {
    const body = document.body

    const listener = () => {
      const scrollableHeight = body.scrollHeight - window.innerHeight
      const scrollRatio = window.scrollY / scrollableHeight
      const degrees = Math.round(scrollRatio * 360)
      body.style.setProperty(`--${varName}`, `${degrees}deg`)
    }

    window.addEventListener('scroll', listener)
    listener()

    return () => {
      window.removeEventListener('scroll', listener)
      body.style.removeProperty(`--${varName}`)
    }
  }, [varName])
}

const orderedLinks = [
  links.twitter,
  links.github,
  links.email,
  links.mal,
  links.facebook,
  links.linkedin,
]

const LinksPage: React.FC = () => {
  useCSSVarScrollRotate()

  return (
    <>
      <Container>
        <div className="h-8 sm:h-20" />
        <div className="relative hidden h-full">
          {floaterComponents.map(([Comp, mult], i) => (
            <div
              aria-hidden="true"
              key={i}
              className="absolute h-36 w-36 text-drac-curr transition-transform duration-75 sm:h-48 sm:w-48"
              style={{
                top: `${(100 * (i + 1)) / floaterComponents.length}vh`,
                right: i % 2 ? `0px` : undefined,
                transform: `rotate(calc(${mult} * var(--scroll-rotate)))`,
              }}
            >
              <Comp role="presentation" className="" />
            </div>
          ))}
        </div>
        <div className="relative">
          <Hero title="Hey, I'm Soorria" isStatic={true}>
            <main className="relative mx-auto mt-8 max-w-md space-y-8 text-lg sm:mt-24 sm:text-xl">
              {orderedLinks.map(({ title, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.anchor}
                >
                  <Icon className="mr-3 h-7 w-7 transition-transform group-hocus:-rotate-12" />
                  <span>{title}</span>
                </a>
              ))}
              <a href={links.site.href + '?ref=links'} className={classes.anchor}>
                <links.site.icon className="mr-3 h-7 w-7 transition-transform duration-300 group-hocus:-rotate-[360deg]" />
                <span>the rest of my website</span>
              </a>
              <div className="h-16" />
            </main>
          </Hero>
        </div>
        <footer className="pt-8 pb-10 text-lg">
          <MadeBy />
        </footer>
      </Container>
    </>
  )
}

export default LinksPage

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      layout: 'nah',
    },
  }
}
