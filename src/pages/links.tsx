import Container from '@/components/Container'
import Hero from '@/components/landing/Hero'
import MadeBy from '@/components/MadeBy'
import Sparkles from '@/components/mdx/Sparkles'
import { links } from '@/links'
import cx from '@/utils/cx'
import { GetStaticProps } from 'next'

const classes = {
  anchor: cx(
    'group flex items-center justify-between rounded-lg bg-drac-bg/70 py-6 px-8 text-drac-pink transition',
    'hocus:bg-drac-bg hocus:text-drac-purple hocus:shadow-xl',
    'focus:outline-none focus:ring focus:ring-drac-purple'
  ),
}

const orderedLinks = [
  links.twitter,
  links.github,
  links.discord,
  links.email,
  links.mal,
  links.facebook,
  links.linkedin,
]

const LinksPage: React.FC = () => {
  return (
    <>
      <Container>
        <div className="h-8 sm:h-20" />
        <div className="relative">
          <Hero title="Hey, I'm Soorria" isStatic={true}>
            <main className="relative mx-auto mt-8 max-w-md space-y-8 text-lg sm:mt-24 sm:text-xl">
              {orderedLinks.map(({ title, href, icon: Icon, iconAlt }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.anchor}
                >
                  <Icon
                    aria-label={iconAlt}
                    className="mr-3 h-7 w-7 transition-transform group-hocus:-rotate-12"
                  />
                  <span>{title}</span>
                </a>
              ))}
              <div className="text-4xl">
                <Sparkles block>
                  <a
                    href={links.site.href + '?ref=links'}
                    className={cx(classes.anchor, 'text-lg shadow-2xl')}
                  >
                    <links.site.icon
                      aria-label={links.site.iconAlt}
                      className="mr-3 h-7 w-7 transition-transform duration-300 group-hocus:-rotate-[360deg]"
                    />
                    <span>the rest of my website</span>
                  </a>
                </Sparkles>
              </div>
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
