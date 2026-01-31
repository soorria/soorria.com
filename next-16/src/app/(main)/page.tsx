import type { ProjectFrontMatter } from '~/types/project'

import Container from '~/components/Container'
import Contact from '~/components/landing/Contact'
import FeaturedProjects from '~/components/landing/FeaturedProjects'
import Hero from '~/components/landing/Hero'
import { getFileFrontMatter } from '~/lib/data'
import { featuredProjects } from '~/constants'
import Skills from '~/components/landing/Skills'
import { randomArray } from '~/utils/random'
import { getSingletonJsonSafe, getSingletonTextSafe } from '~/lib/supabase'
import { getRandomSkillIndexes } from '~/lib/skills/definitions'
import Subtitle from '~/components/landing/Subtitle'
import MdxRenderer from '~/components/mdx/MdxRenderer'
import { PageRenderedAt } from '~/components/PageRenderedAt'

export const revalidate = 10

const getSubtitleOptions = async () => {
  const subtitleText = (await getSingletonTextSafe('subtitle')) ?? ''
  const subtitleChunks = subtitleText
    .split('---')
    .map(chunk => chunk.trim().replace(/\.$/, ''))
    .filter(Boolean)
  return subtitleChunks
}

const getNow = async () => {
  const nowText = await getSingletonTextSafe('now')
  return nowText || null
}

const IndexPage = async () => {
  const subtitleOptionsPromise = getSubtitleOptions()

  const nowPromise = getNow()

  const indexOptionsPromise = getSingletonJsonSafe<{ heroText: string; pattern?: string }>(
    'index-options'
  )

  const projectsPromise: Promise<ProjectFrontMatter[]> = Promise.all(
    featuredProjects.map(async projectSlug => {
      const frontmatter = await getFileFrontMatter<ProjectFrontMatter>('projects', projectSlug)
      delete frontmatter.readingTime
      return frontmatter
    })
  )

  const randoms = randomArray(0, 100, 5)

  const skillIndexes = getRandomSkillIndexes(8)

  const [subtitleOptions, now, projects, { heroText, pattern }] = await Promise.all([
    subtitleOptionsPromise,
    nowPromise,
    projectsPromise,
    indexOptionsPromise,
  ])

  return (
    <Container>
      <Hero
        subtitle={
          <Subtitle
            options={subtitleOptions.map((code, i) => (
              <MdxRenderer key={i} code={code} hasCodeBlocks={false} />
            ))}
          />
        }
        title={heroText}
        pattern={pattern}
      >
        {now ? (
          <div className="text-pretty text-lg" id="now">
            <MdxRenderer code={now} hasCodeBlocks={false} />
          </div>
        ) : null}
      </Hero>
      <FeaturedProjects random={randoms[0]} projects={projects} />
      <Skills random={randoms[1]} skillIndexes={skillIndexes} />
      <Contact random={randoms[2]} />
      <div className="py-10" />
      <PageRenderedAt />
    </Container>
  )
}

export default IndexPage
