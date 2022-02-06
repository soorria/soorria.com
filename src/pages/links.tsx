import Container from '@/components/Container'
import Hero from '@/components/landing/Hero'
import MadeBy from '@/components/MadeBy'
import { allLinks, links } from '@/links'
import cx from '@/utils/cx'
import { GetStaticProps } from 'next'

const classes = {
  anchor: cx(
    'group flex items-center justify-between rounded-lg bg-drac-bg/70 py-6 px-8 text-drac-pink transition',
    'hocus:bg-drac-bg hocus:text-drac-purple',
    'focus:outline-none focus:ring focus:ring-drac-purple'
  ),
}

const LinksPage: React.FC = () => {
  return (
    <Container>
      <div className="h-8 sm:h-20" />
      <Hero title="Hey, I'm Soorria" isStatic={true}>
        <main className="mx-auto mt-8 max-w-md space-y-8 text-lg sm:mt-24 sm:text-xl">
          {allLinks.map(({ title, href, icon: Icon }) => (
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
          <a href={links.site.href} className={classes.anchor}>
            <links.site.icon className="mr-3 h-7 w-7 transition-transform duration-300 group-hocus:-rotate-[360deg]" />
            <span>the rest of my website</span>
          </a>
          <div className="h-16" />
        </main>
      </Hero>
      <footer className="pt-8 pb-10">
        <MadeBy />
      </footer>
    </Container>
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
