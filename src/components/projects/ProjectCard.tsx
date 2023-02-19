import { For, lazy, VoidComponent } from 'solid-js'
import { A } from 'solid-start'

import type { Project } from '~/types/project'

import { CodeIcon, ExternalIcon, InfoIcon } from '../icons'

export interface ProjectCardProps {
  project: Project
}

export type ProjectCardComponent = VoidComponent<ProjectCardProps>

const projectCardMap: Record<string, ProjectCardComponent> = {
  'jupyter-js': lazy(() => import('./jupyter-js/JupyterJsCard')),
  'clinically-relevant': lazy(() => import('./clinically-relevant/ClinicallyRelevantCard')),
  'not-messenger': lazy(() => import('./not-messenger/NotMessengerCard')),
  sizes: lazy(() => import('./sizes/SizesCard')),
  pokelife: lazy(() => import('./pokelife/PokelifeCard')),
}

const classes = {
  link: 'inline-flex items-center space-x-1 text-drac-pink underline hocus:text-drac-purple focus-ring rounded -mx-1 px-1',
}

const ProjectCard: ProjectCardComponent = props => {
  if (props.project.slug in projectCardMap) {
    const Comp = projectCardMap[props.project.slug]!
    return <Comp project={props.project} />
  }

  return (
    <div class="flex flex-col space-y-3">
      <div class="font-display text-xl font-bold text-drac-pink">
        {props.project.title}
        {props.project.wip && (
          <span class="ml-2 font-sans text-sm font-normal italic">
            (<abbr title="work in progress">WIP</abbr>)
          </span>
        )}
      </div>
      <div class="flex-1">{props.project.shortDescription}</div>
      <div>
        <div class="flex flex-wrap gap-2 text-xs text-drac-content text-opacity-80">
          <For each={props.project.stack}>{tech => <span>{tech}</span>}</For>
        </div>
      </div>
      <div class="flex space-x-4 text-sm">
        {props.project.hasContent && (
          <A
            href={`/projects/${props.project.slug}`}
            aria-label={`See details for ${props.project.title}`}
            class={classes.link}
          >
            <InfoIcon class="inline-block h-4 w-4" />
            <span>Details</span>
            <span class="sr-only"> for {props.project.title}</span>
          </A>
        )}

        {props.project.live && (
          <a
            href={props.project.live}
            aria-label={`View the live site for ${props.project.title}`}
            class={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalIcon class="inline-block h-4 w-4" />
            <span>
              See <span class="sr-only">{props.project.title}</span> Live
            </span>
          </a>
        )}

        {props.project.source && (
          <a
            href={props.project.source}
            aria-label={`View the source code for ${props.project.title}`}
            class={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CodeIcon class="inline-block h-4 w-4" />
            <span>Source</span>
            <span class="sr-only"> for {props.project.title}</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
