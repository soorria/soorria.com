import { GetStaticProps } from 'next'

import Container from '@/components/Container'
import Contact from '@/components/landing/Contact'
import FeaturedProjects from '@/components/landing/FeaturedProjects'
import Hero from '@/components/landing/Hero'
import { getFileFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import { ProjectFrontMatter } from '@/types/project'
import { featuredProjects } from '@/constants'
import Skills from '@/components/landing/Skills'
import { randomArray } from '@/utils/random'
import { getSingletonJsonSafe, getSingletonTextSafe } from '@/lib/supabase'
import { useMdxComponent } from '@/lib/mdx'
import { render } from '@/lib/mdx.server'

interface IndexProps {
  subtitle: string | null
  nowMdx: string | null
  projects: ProjectFrontMatter[]
  randoms: number[]
  renderedAt: string
  isHeroStatic?: boolean
}

const IndexPage: React.FC<IndexProps> = ({ subtitle, nowMdx, projects, randoms, isHeroStatic }) => {
  const Now = useMdxComponent(nowMdx)

  return (
    <Container>
      <Hero subtitle={subtitle} title="Hey, I'm Soorria" isStatic={isHeroStatic}>
        <div className="text-lg">
          <Now />
        </div>
      </Hero>
      <FeaturedProjects random={randoms[0]} projects={projects} />
      <Skills random={randoms[1]} />
      <Contact random={randoms[2]} />
      <div className="py-10" />
    </Container>
  )
}

export default IndexPage

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const subtitle = await getSingletonTextSafe('subtitle')

  const nowText = await getSingletonTextSafe('now')
  const nowMdx = nowText ? (await render(nowText)).code : null

  const { isHeroStatic } = await getSingletonJsonSafe('index-options')

  const projects: ProjectFrontMatter[] = await Promise.all(
    featuredProjects.map(async projectSlug => {
      const frontmatter = await getFileFrontMatter<ProjectFrontMatter>(
        DataType.projects,
        projectSlug
      )
      delete frontmatter.readingTime
      return frontmatter
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
      isHeroStatic: Boolean(isHeroStatic),
    },
    revalidate: 1,
  }
}
