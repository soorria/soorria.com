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
import { featuredProjects } from '@/constants'
import Skills from '@/components/landing/Skills'
import { randomArray } from '@/utils/random'
import { getSingletonText } from '@/lib/supabase'

interface IndexProps {
  subtitle: string
  nowMdx: MdxRemote.Source
  projects: ProjectFrontMatter[]
  randoms: number[]
  renderedAt: string
}

const IndexPage: React.FC<IndexProps> = ({ subtitle, nowMdx, projects, randoms, renderedAt }) => {
  const now = hydrate(nowMdx)

  return (
    <Container>
      <Hero subtitle={subtitle} now={now} />
      <FeaturedProjects random={randoms[0]} projects={projects} />
      <Skills random={randoms[1]} />
      <Contact random={randoms[2]} />
      <div
        className="py-10 text-sm text-center transition-colors text-drac-curr hover:text-drac-fg"
        aria-hidden
      >
        Rendered at {new Date(renderedAt).toLocaleString()}
      </div>
    </Container>
  )
}

export default IndexPage

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const subtitle = await getSingletonText('subtitle')

  const nowText = await getSingletonText('now')
  const nowMdx = await render(nowText)

  const projects: ProjectFrontMatter[] = await Promise.all(
    featuredProjects.map(async projectSlug => {
      const {
        mdxSource: _,
        readingTime: __,
        ...rest
      } = await getFileWithMdx<Project>(DataType.projects, projectSlug)
      return rest
    })
  )

  const randoms = randomArray(0, 100, 5)

  return {
    props: {
      subtitle,
      nowMdx,
      projects,
      randoms,
      renderedAt: new Date().toISOString(),
    },
    revalidate: 1,
  }
}
