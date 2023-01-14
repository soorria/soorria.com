import type { ProjectFrontMatter } from '~/types/project'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { CodeIcon, ExternalIcon, InfoIcon } from '../icons'

export interface ProjectCardProps {
  project: ProjectFrontMatter
}

export type ProjectCardComponent = React.ComponentType<ProjectCardProps>

const projectCardMap: Record<string, ProjectCardComponent> = {
  'jupyter-js': dynamic(() => import('./jupyter-js/JupyterJsCard')),
  'clinically-relevant': dynamic(() => import('./clinically-relevant/ClinicallyRelevantCard')),
  'not-messenger': dynamic(() => import('./not-messenger/NotMessengerCard')),
  sizes: dynamic(() => import('./sizes/SizesCard')),
  pokelife: dynamic(() => import('./pokelife/PokelifeCard')),
}

const classes = {
  link: 'inline-flex items-center space-x-1 text-drac-pink underline hocus:text-drac-purple focus-ring rounded -mx-1 px-1',
}

const ProjectCard: ProjectCardComponent = ({ project }) => {
  if (project.slug in projectCardMap) {
    const Comp = projectCardMap[project.slug]!
    return <Comp project={project} />
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="font-display text-xl font-bold text-drac-pink">
        {project.title}
        {project.wip && (
          <span className="ml-2 font-sans text-sm font-normal italic">
            (<abbr title="work in progress">WIP</abbr>)
          </span>
        )}
      </div>
      <div className="flex-1">{project.shortDescription}</div>
      <div>
        <div className="-mt-1 -ml-2 flex flex-wrap text-xs text-drac-content text-opacity-80">
          {project.stack.map(tech => (
            <span key={tech} className="mt-1 ml-2">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-4 text-sm">
        {project.hasContent && (
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`See details for ${project.title}`}
            className={classes.link}
          >
            <InfoIcon className="inline-block h-4 w-4" />
            <span>Details</span>
            <span className="sr-only"> for {project.title}</span>
          </Link>
        )}

        {project.live && (
          <a
            href={project.live}
            aria-label={`View the live site for ${project.title}`}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalIcon className="inline-block h-4 w-4" />
            <span>
              See <span className="sr-only">{project.title}</span> Live
            </span>
          </a>
        )}

        {project.source && (
          <a
            href={project.source}
            aria-label={`View the source code for ${project.title}`}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CodeIcon className="inline-block h-4 w-4" />
            <span>Source</span>
            <span className="sr-only"> for {project.title}</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
