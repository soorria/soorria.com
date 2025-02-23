import type { ProjectFrontMatter } from '~/lib/data/types'
import { CodeIcon, ExternalIcon, InfoIcon } from '../icons'
import { lazy } from 'react'

export interface ProjectCardProps {
  project: ProjectFrontMatter
}

export type ProjectCardComponent = React.ComponentType<ProjectCardProps>

const projectCardMap: Record<string, ProjectCardComponent> = {
  'jupyter-js': lazy(() => import('./jupyter-js/JupyterJsCard')),
  'clinically-relevant': lazy(() => import('./clinically-relevant/ClinicallyRelevantCard')),
  'not-messenger': lazy(() => import('./not-messenger/NotMessengerCard')),
  sizes: lazy(() => import('./sizes/SizesCard')),
  pokelife: lazy(() => import('./pokelife/PokelifeCard')),
  'magic-sprinkles': lazy(() => import('./magic-sprinkles/MagicSprinklesCard')),
  'prompt-racer': lazy(() => import('./prompt-racer/PromptRacerCard')),
}

const classes = {
  link: 'inline-flex items-center space-x-1 text-drac-pink underline hocus:text-drac-purple focus-ring rounded-sm -mx-1 px-1',
}

const ProjectCard: ProjectCardComponent = ({ project }) => {
  if (project.id in projectCardMap) {
    const Comp = projectCardMap[project.id]!
    return <Comp project={project} />
  }

  return (
    <div className="flex flex-col space-y-3" id={project.id}>
      <div className="font-display text-drac-pink text-xl font-bold">
        {project.data.title}
        {project.data.wip && (
          <span className="ml-2 font-sans text-sm font-normal italic">
            (<abbr title="work in progress">WIP</abbr>)
          </span>
        )}
      </div>
      <div className="flex-1">{project.data.shortDescription}</div>
      <div>
        <div className="text-drac-content/80 flex flex-wrap gap-2 text-xs">
          {project.data.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        {project.data.hasContent && (
          <a
            href={`/projects/${project.id}`}
            aria-label={`See details for ${project.data.title}`}
            className={classes.link}
          >
            <InfoIcon className="inline-block h-4 w-4" />
            <span>Details</span>
            <span className="sr-only"> for {project.data.title}</span>
          </a>
        )}

        {project.data.live && (
          <a
            href={project.data.live}
            aria-label={`View the live site for ${project.data.title}`}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalIcon className="inline-block h-4 w-4" />
            <span>
              See <span className="sr-only">{project.data.title}</span> Live
            </span>
          </a>
        )}

        {project.data.source && (
          <a
            href={project.data.source}
            aria-label={`View the source code for ${project.data.title}`}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CodeIcon className="inline-block h-4 w-4" />
            <span>Source</span>
            <span className="sr-only"> for {project.data.title}</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
