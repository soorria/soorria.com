import Container from '@/components/Container'
import Hero from '@/components/landing/Hero'
import { allLinks } from '@/links'
import cx from '@/utils/cx'
import { GetStaticProps } from 'next'

const LinksPage: React.FC = () => {
  return (
    <Container>
      <div className="h-8 sm:h-20" />
      <Hero
        title="Hey, I'm Soorria"
        now={
          <div className="mx-auto mt-8 max-w-md space-y-8 text-lg sm:mt-24 sm:text-xl">
            {allLinks.map(({ title, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  'group flex items-center justify-between rounded-lg bg-drac-bg/70 py-6 px-8 text-drac-pink transition',
                  'hover:bg-drac-bg hover:text-drac-purple',
                  'focus:bg-drac-bg focus:text-drac-purple',
                  'focus:outline-none focus:ring focus:ring-drac-purple'
                )}
              >
                <Icon className="mr-3 h-7 w-7 transition-transform group-hover:-rotate-12" />
                <span>{title}</span>
              </a>
            ))}
            <div className="h-24" />
          </div>
        }
        isStatic={true}
      />
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
