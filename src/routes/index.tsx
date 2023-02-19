import { RouteDataArgs, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import Contact from '~/components/landing/Contact'
import FeaturedProjects from '~/components/landing/FeaturedProjects'
import Hero from '~/components/landing/Hero'
import Skills from '~/components/landing/Skills'
import Subtitle from '~/components/landing/Subtitle'
import Container from '~/components/layout/Container'
import { featuredProjects } from '~/constants'
import { getFileFrontMatter } from '~/lib/data'
import { mdToHtml } from '~/lib/markdown'
import { getRandomSkillIndexes } from '~/lib/skills'
import { getSingletonJsonSafe, getSingletonTextSafe } from '~/lib/supabase'
import { ProjectFrontMatter } from '~/types/project'
import { randomArray } from '~/utils/random'

export const routeData = ({}: RouteDataArgs) => {
  const subtitleOptions = createServerData$(async () => {
    try {
      const subtitleText = (await getSingletonTextSafe('subtitle')) ?? ''
      const subtitleChunks = subtitleText
        .split('---')
        .map(chunk => chunk.trim())
        .filter(Boolean)

      const subtitles = await Promise.all(
        subtitleChunks.map(chunk => mdToHtml(chunk, { inline: true }))
      )

      console.log(subtitles)

      return subtitles
    } catch {
      return [
        `I'm a full stack software engineer passionate about creating performant and <Sparkles>fun</Sparkles> software that enables users to do more with less`,
      ]
    }
  })

  const now = createServerData$(async () => {
    const nowText = await getSingletonTextSafe('now')
    return nowText ? await mdToHtml(nowText ?? '', { inline: true }) : null
  })

  const indexOptions = createServerData$(
    () => getSingletonJsonSafe('index-options') as Promise<{ heroText: string }>
  )
  const heroText = () =>
    indexOptions.state === 'ready' ? indexOptions()?.heroText ?? "Hey, I'm Soorria!" : null

  const projects = createServerData$(async () => {
    const projects = await Promise.all(
      featuredProjects.map(async projectSlug => {
        const frontmatter = await getFileFrontMatter<ProjectFrontMatter>('projects', projectSlug)
        delete frontmatter.readingTime
        return frontmatter
      })
    )
    return projects
  })

  const randoms = randomArray(0, 100, 5)

  const skillIndexes = getRandomSkillIndexes(8)

  return {
    subtitleOptions,
    now,
    projects,
    randoms,
    renderedAt: new Date().toISOString(),
    // list,
    heroText,
    skillIndexes,
  }
}

export default function Home() {
  const { randoms, skillIndexes, subtitleOptions, now, projects } = useRouteData<typeof routeData>()

  return (
    <Container>
      <Hero title="Hey, I'm Soorria!" subtitle={<Subtitle options={subtitleOptions()} />}>
        {/* eslint-disable-next-line solid/no-innerhtml */}
        <div class="md text-lg" id="now" innerHTML={now() || ''} />
      </Hero>

      <FeaturedProjects random={randoms[0]} projects={projects()!} />
      <Skills random={randoms[1]} skillIndexes={skillIndexes} />
      <Contact random={randoms[2]} />

      <div class="py-10" />
    </Container>
  )
}
