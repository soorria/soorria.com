import './index.css'

import { customElement, noShadowDOM } from 'solid-element'
import { lazy } from 'solid-js'
import { RouteDataArgs, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import Contact from '~/components/landing/Contact'
import FeaturedProjects from '~/components/landing/FeaturedProjects'
import Hero from '~/components/landing/Hero'
import Skills from '~/components/landing/Skills'
import Subtitle from '~/components/landing/Subtitle'
import Container from '~/components/layout/Container'
import { featuredProjects } from '~/constants'
// import mod from '~/data/misc/about/index.mdx'
import { projectFrontMatters } from '~/lib/data'
import { mdToHtml } from '~/lib/markdown'
import { getRandomSkillIndexes } from '~/lib/skills'
import { getSingletonJsonSafe, getSingletonTextSafe } from '~/lib/supabase'
import { Project } from '~/types/project'
import { randomArray } from '~/utils/random'

if (typeof window !== 'undefined') {
  const Sparkles = lazy(() => import('~/components/mdx/Sparkles'))
  customElement('s-sparkles', { children: null }, props => {
    noShadowDOM()
    return <Sparkles absolute>{props.children}</Sparkles>
  })
}

// console.log('@@mod', typeof mod !== 'undefined' && mod)

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

  const heroText = createServerData$(() =>
    (getSingletonJsonSafe('index-options') as Promise<{ heroText: string }>).then(
      opt => opt.heroText ?? "Hey, I'm Soorria!"
    )
  )

  const projects = createServerData$(async () => {
    const fp = featuredProjects
      .map(slug => {
        return projectFrontMatters.bySlug[slug]
      })
      .filter(Boolean) as Project[]
    return fp
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
