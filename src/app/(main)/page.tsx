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
import { getCachedSingletonJsonSafe, getCachedSingletonTextSafe } from '~/lib/supabase'
import { render } from '~/lib/mdx.server'
import { getRandomSkillIndexes } from '~/lib/skills'
import Subtitle from '~/components/landing/Subtitle'
import { Mdx } from '~/components/landing/mdx'
import { unstable_cache } from 'next/cache'

export const revalidate = 10

const renderText = unstable_cache(
  (text: string): Promise<string> =>
    render(text, undefined, { hasCodeBlocks: false }).then(result => result.code)
)

const getSubtitleOptions = unstable_cache(async () => {
  const subtitleText = (await getCachedSingletonTextSafe('subtitle')) ?? ''
  const subtitleChunks = subtitleText
    .split('---')
    .map(chunk => chunk.trim().replace(/\.$/, ''))
    .filter(Boolean)
  return await Promise.all(subtitleChunks.map(chunk => renderText(chunk)))
})

const getNow = unstable_cache(async () => {
  const nowText = await getCachedSingletonTextSafe('now')
  return nowText ? await renderText(nowText ?? '') : null
})

const IndexPage = async () => {
  const subtitleOptionsPromise = getSubtitleOptions()

  const nowPromise = getNow()

  const indexOptionsPromise = getCachedSingletonJsonSafe<{ heroText: string }>('index-options')

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

  const randoms = randomArray(0, 100, 5)

  const skillIndexes = getRandomSkillIndexes(8)

  const [subtitleOptions, now, projects, { heroText }] = await Promise.all([
    subtitleOptionsPromise,
    nowPromise,
    projectsPromise,
    indexOptionsPromise,
  ])

  return (
    <Container>
      <Hero subtitle={<Subtitle options={subtitleOptions} />} title={heroText}>
        <div className="text-lg" id="now">
          <Mdx code={now} />
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
