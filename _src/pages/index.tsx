import type { GetStaticProps } from 'next'
import type { ProjectFrontMatter } from '~/types/project'

import Container from '~/components/Container'
import Contact from '~/components/landing/Contact'
import FeaturedProjects from '~/components/landing/FeaturedProjects'
import Hero from '~/components/landing/Hero'
import { getFileFrontMatter } from '~/lib/data'
import { DataType } from '~/types/data'
import { featuredProjects } from '~/constants'
import Skills from '~/components/landing/Skills'
import { randomArray } from '~/utils/random'
import { getSingletonJsonSafe, getSingletonTextSafe } from '~/lib/supabase'
import { useMdxComponent } from '~/components/landing/mdx'
import { render } from '~/lib/mdx.server'
import { getRandomSkillIndexes } from '~/lib/skills'
import Subtitle from '~/components/landing/Subtitle'

interface IndexProps {
  subtitleOptions: string[] | null
  now: string | null
  projects: ProjectFrontMatter[]
  randoms: number[]
  renderedAt: string
  heroText: string
  skillIndexes: number[]
}

const IndexPage: React.FC<IndexProps> = ({
  subtitleOptions,
  now,
  projects,
  randoms,
  heroText,
  skillIndexes,
}) => {
  const Now = useMdxComponent(now)

  return (
    <Container>
      <Hero subtitle={<Subtitle options={subtitleOptions} />} title={heroText}>
        <div className="text-lg" id="now">
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
  const renderText = (text: string) =>
    render(text, undefined, { hasCodeBlocks: false }).then(result => result.code)

  const subtitleOptionsPromise = (async () => {
    const subtitleText = (await getSingletonTextSafe('subtitle')) ?? ''
    const subtitleChunks = subtitleText
      .split('---')
      .map(chunk => chunk.trim())
      .filter(Boolean)
    return await Promise.all(subtitleChunks.map(chunk => renderText(chunk)))
  })()

  const nowPromise = (async () => {
    const nowText = await getSingletonTextSafe('now')
    return nowText ? await renderText(nowText ?? '') : null
  })()

  const indexOptionsPromise = getSingletonJsonSafe('index-options')

  const projectsPromise: Promise<ProjectFrontMatter[]> = Promise.all(
    featuredProjects.map(async projectSlug => {
      const frontmatter = await getFileFrontMatter<ProjectFrontMatter>(
        DataType.projects,
        projectSlug
      )
      delete frontmatter.readingTime
      return frontmatter
    })
  )

  const REVALIDATE = 10

  const randoms = randomArray(0, 100, 5)

  const skillIndexes = getRandomSkillIndexes(8)

  const [subtitleOptions, now, projects, { heroText }] = await Promise.all([
    subtitleOptionsPromise,
    nowPromise,
    projectsPromise,
    indexOptionsPromise,
  ])

  console.log({
    randoms,
    skillIndexes,
    heroText,
  })

  return {
    props: {
      subtitleOptions,
      now,
      projects,
      randoms,
      renderedAt: new Date().toISOString(),
      heroText: typeof heroText === 'string' ? heroText : "Hey, I'm Soorria",
      skillIndexes,
    },
    revalidate: REVALIDATE,
  }
}
