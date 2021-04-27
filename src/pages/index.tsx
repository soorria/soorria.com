import Container from '@/components/Container'
import Contact from '@/components/landing/Contact'
import Education from '@/components/landing/Education'
import FeaturedProjects from '@/components/landing/FeaturedProjects'
import FeaturedWork from '@/components/landing/FeaturedWork'
import Hero from '@/components/landing/hero'
import { getFileWithMdx } from '@/lib/data'
import { hydrate } from '@/lib/mdx-hydrate'
import { render } from '@/lib/mdx-render'
import { DataType } from '@/types/data'
import { Project, ProjectFrontMatter } from '@/types/project'
import { WorkFrontMatter } from '@/types/work'
import { GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'

interface IndexProps {
  subtitleMdx: MdxRemote.Source
  nowMdx: MdxRemote.Source
  projects: ProjectFrontMatter[]
}

const work: WorkFrontMatter[] = [
  {
    slug: 'freelance-web-dev',
    title: 'Freelance Web Developer',
    company: 'Maclean Natural Health',
    from: 'Nov 2020',
    shortDescription: `
      Built a mobile-friendly e-commerce website using React, Next.js for the web
      frontend and Stripe to handle secure payments. Consulted with client to 
      create an intuitive live Admin dashboard to manage general site information,
      products and order fulfillment. Used MongoDB to persist all required data and
      Google OAuth for a simple login experience.
    `,
    location: 'Sydney, NSW',
    tech_used: [
      'Next.js',
      'React',
      'MongoDB',
      'Stripe',
      'TypeScript',
      'Google OAuth',
      'Chakra UI',
      'Firebase Auth',
    ],
  },
  {
    slug: 'casual-academic-unsw',
    title: 'Casual Academic',
    company: 'University of New South Wales',
    from: 'Jan 2021',
    shortDescription: `Academic tutor and lab assistant for COMP6080 - Web Front-End Programming.`,
    location: 'Sydney, NSW',
    tech_used: [
      'React',
      'HTML',
      'CSS',
      'JavaScript',
      'Jest',
      'Enzyme',
      'Storybook',
      'Cypress',
      'Material UI',
    ],
  },
]

const featuredProjects = ['jupyter-js', 'clinically-relevant', 'not-messenger', 'mooth-tech']

const subtitleSource = `
I'm a full stack software engineer and Computer Science student
based in Sydney, Australia.
`

const nowSource = `
Right now, I'm a freelance web developer helping small businesses
enter the online space and in my free time I'm working on
[jupyter.js](https://jjs.mooth.tech). Sometimes I play around with
Go and Python.
`

const IndexPage: React.FC<IndexProps> = ({ subtitleMdx, nowMdx, projects }) => {
  const subtitle = hydrate(subtitleMdx)
  const now = hydrate(nowMdx)

  return (
    <Container>
      <Hero subtitle={subtitle} now={now} />
      <FeaturedProjects projects={projects} />
      <FeaturedWork work={work} />
      <Education />
      <Contact />
      <div className="pb-20" />
    </Container>
  )
}

export default IndexPage

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const subtitleMdx = await render(subtitleSource)
  const nowMdx = await render(nowSource)

  const projects: ProjectFrontMatter[] = await Promise.all(
    featuredProjects.map(async projectSlug => {
      const project = await getFileWithMdx<Project>(DataType.projects, projectSlug)
      return {
        ...project,
        mdxSource: null,
      }
    })
  )

  return {
    props: {
      subtitleMdx,
      nowMdx,
      projects,
    },
  }
}
