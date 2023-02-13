import { globby } from 'globby'
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
import { getRandomSkillIndexes } from '~/lib/skills'
import { getSingletonJsonSafe, getSingletonTextSafe } from '~/lib/supabase'
import { ProjectFrontMatter } from '~/types/project'
import { randomArray } from '~/utils/random'

export const routeData = ({}: RouteDataArgs) => {
  // const renderText = (text: string) =>
  //   render(text, undefined, { hasCodeBlocks: false }).then(result => result.code)

  const subtitleOptions = createServerData$(async () => {
    const subtitleText = (await getSingletonTextSafe('subtitle')) ?? ''
    const subtitleChunks = subtitleText
      .split('---')
      .map(chunk => chunk.trim())
      .filter(Boolean)

    //   return await Promise.all(subtitleChunks.map(chunk => renderText(chunk)))

    return subtitleChunks
  })

  const now = createServerData$(async () => {
    const nowText = await getSingletonTextSafe('now')
    return nowText ?? null
    // return nowText ? await renderText(nowText ?? '') : null
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

  const list = createServerData$(async () => {
    const files = await globby(['./*'])
    return files
  })

  const randoms = randomArray(0, 100, 5)

  const skillIndexes = getRandomSkillIndexes(8)

  return {
    subtitleOptions,
    now,
    projects,
    randoms,
    renderedAt: new Date().toISOString(),
    list,
    heroText,
    skillIndexes,
  }
}

export default function Home() {
  const { randoms, skillIndexes, subtitleOptions, now, projects, list } =
    useRouteData<typeof routeData>()

  return (
    <Container>
      <Hero title="Hey, I'm Soorria!" subtitle={<Subtitle options={subtitleOptions()} />}>
        <div class="text-lg" id="now">
          {now()}
        </div>
      </Hero>

      <pre class="overflow-x-auto">{list()}</pre>

      <FeaturedProjects random={randoms[0]} projects={projects()!} />
      <Skills random={randoms[1]} skillIndexes={skillIndexes} />
      <Contact random={randoms[2]} />

      <div class="py-10" />
    </Container>
  )
}
