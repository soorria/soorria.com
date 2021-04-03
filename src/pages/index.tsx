import Container from '@/components/Container'
import FeaturedProjects from '@/components/landing/FeaturedProjects'
import Hero from '@/components/landing/hero'
import { getFileWithMdx } from '@/lib/data'
import { hydrate } from '@/lib/mdx-hydrate'
import { render } from '@/lib/mdx-render'
import { DataType } from '@/types/data'
import { Project, ProjectFrontMatter } from '@/types/project'
import { GetStaticProps } from 'next'
import { MdxRemote } from 'next-mdx-remote/types'

interface IndexProps {
  subtitleMdx: MdxRemote.Source
  nowMdx: MdxRemote.Source
  projects: ProjectFrontMatter[]
}

const featuredProjects = ['jupyter-js', 'clinically-relevant', 'not-messenger', 'mooth-tech']

const subtitleSource = `
I'm a full stack software engineer and Computer Science student
based in Sydney, Australia.
`

const nowSource = `
Right now, I'm a freelance web developer helping small businesses
enter the online space and in my free time I'm working on
[jupyter.js](https://jjs.mooth.tech).
`

const IndexPage: React.FC<IndexProps> = ({ subtitleMdx, nowMdx, projects }) => {
  const subtitle = hydrate(subtitleMdx)
  const now = hydrate(nowMdx)

  return (
    <Container>
      <Hero subtitle={subtitle} now={now} />
      <FeaturedProjects projects={projects} />
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
