import type { GetStaticProps } from 'next'
import type { ProjectFrontMatter } from '@/types/project'

import Container from '@/components/Container'
import Contact from '@/components/landing/Contact'
import FeaturedProjects from '@/components/landing/FeaturedProjects'
import Hero from '@/components/landing/Hero'
import { getFileFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import { featuredProjects } from '@/constants'
import Skills from '@/components/landing/Skills'
import { randomArray } from '@/utils/random'
import { getSingletonJsonSafe, getSingletonTextSafe } from '@/lib/supabase'
import { useMdxComponent } from '@/lib/mdx'
import { render } from '@/lib/mdx.server'
import { getRandomSkillIndexes } from '@/lib/skills'
import Subtitle from '@/components/landing/Subtitle'

interface IndexProps {
  subtitleOptions: string[] | null
  now: string | null
  projects: ProjectFrontMatter[]
  randoms: number[]
  renderedAt: string
  isHeroStatic?: boolean
  skillIndexes: number[]
}

const IndexPage: React.FC<IndexProps> = ({
  subtitleOptions,
  now,
  projects,
  randoms,
  isHeroStatic,
  skillIndexes,
}) => {
  const Now = useMdxComponent(now)

  return (
    <Container>
      <Hero
        subtitle={<Subtitle options={subtitleOptions} />}
        title="Hey, I'm Soorria"
        isStatic={isHeroStatic}
      >
        <div className="text-lg">
          <Now />
        </div>
      </Hero>
      <FeaturedProjects random={randoms[0]} projects={projects} />
      <Skills random={randoms[1]} skillIndexes={skillIndexes} />
      <Contact random={randoms[2]} />
      <div className="py-10" />
    </Container>
  )
}

export default IndexPage

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const subtitleText = (await getSingletonTextSafe('subtitle')) ?? ''
  const subtitleChunks = subtitleText
    .split('---')
    .map(chunk => chunk.trim())
    .filter(Boolean)
  const subtitleOptions = await Promise.all(
    subtitleChunks.map(chunk => render(chunk).then(({ code }) => code))
  )

  const nowText = await getSingletonTextSafe('now')
  const now = nowText ? (await render(nowText ?? '')).code : null

  const { isHeroStatic, nSkills = 8 } = await getSingletonJsonSafe('index-options')

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

  const skillIndexes = getRandomSkillIndexes(
    typeof nSkills === 'number' && nSkills > 0 ? nSkills : 8
  )

  return {
    props: {
      subtitleOptions,
      now,
      projects,
      randoms,
      renderedAt: new Date().toISOString(),
      isHeroStatic: Boolean(isHeroStatic),
      skillIndexes,
    },
    revalidate: 1,
  }
}
