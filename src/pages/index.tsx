import { GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'

import Container from '@/components/Container'
import Contact from '@/components/landing/Contact'
import FeaturedProjects from '@/components/landing/FeaturedProjects'
import Hero from '@/components/landing/Hero'
import { getFileWithMdx } from '@/lib/data'
import { hydrate } from '@/lib/mdx-hydrate'
import { render } from '@/lib/mdx-render'
import { DataType } from '@/types/data'
import { Project, ProjectFrontMatter } from '@/types/project'
import { featuredProjects } from '@/contants'
import Skills from '@/components/landing/Skills'
// import Skills from '@/components/landing/Skills'

interface IndexProps {
  subtitleMdx: MdxRemote.Source
  nowMdx: MdxRemote.Source
  projects: ProjectFrontMatter[]
}

const IndexPage: React.FC<IndexProps> = ({ subtitleMdx, nowMdx, projects }) => {
  const subtitle = hydrate(subtitleMdx)
  const now = hydrate(nowMdx)

  return (
    <Container>
      <Hero subtitle={subtitle} now={now} />
      <FeaturedProjects projects={projects} />
      {/* <FeaturedWork work={work} /> */}
      <Skills />
      {/* <Education /> */}
      <Contact />
      <div className="pb-20" />
    </Container>
  )
}

export default IndexPage

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const subtitleMdx = await render(`
I'm a full stack software engineer and Actuarial Studies & Computer Science
student based in Sydney, Australia.`)
  const nowMdx = await render(`
Right now, I'm a freelance software engineer helping small businesses
enter the online space and in my free time I'm working on
[jupyter.js](https://jjs.mooth.tech). Sometimes I play around with
Go and Python.`)

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
