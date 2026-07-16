import { lazy, Suspense } from 'react'
import { CodeIcon, ExternalIcon, InfoIcon } from '../icons'

interface ProjectFrontMatter {
  slug: string
  title: string
  shortDescription: string
  stack: string[]
  source?: string
  live?: string
  wip?: boolean
  hasContent?: boolean
}

export interface ProjectCardProps {
  project: ProjectFrontMatter
}

export type ProjectCardComponent = React.ComponentType<ProjectCardProps>

// Lazy load special cards
const JupyterJsCard = lazy(() => import('./jupyter-js/JupyterJsCard'))
const ClinicallyRelevantCard = lazy(() => import('./clinically-relevant/ClinicallyRelevantCard'))
const NotMessengerCard = lazy(() => import('./not-messenger/NotMessengerCard'))
const SizesCard = lazy(() => import('./sizes/SizesCard'))
const PokelifeCard = lazy(() => import('./pokelife/PokelifeCard'))
const MagicSprinklesCard = lazy(() => import('./magic-sprinkles/MagicSprinklesCard'))
const PromptRacerCard = lazy(() => import('./prompt-racer/PromptRacerCard'))

const projectCardMap: Record<string, ProjectCardComponent> = {
  'jupyter-js': JupyterJsCard,
  'clinically-relevant': ClinicallyRelevantCard,
  'not-messenger': NotMessengerCard,
  sizes: SizesCard,
  pokelife: PokelifeCard,
  'magic-sprinkles': MagicSprinklesCard,
  'prompt-racer': PromptRacerCard,
}

const classes = {
  link: 'inline-flex items-center space-x-1 text-drac-pink underline hocus:text-drac-purple focus-ring rounded-sm -mx-1 px-1',
}

const DefaultProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col space-y-3" id={project.slug}>
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
        <div className="flex flex-wrap gap-2 text-xs text-drac-content/80">
          {project.stack.map(tech => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        {project.hasContent && (
          <a
            href={`/projects/${project.slug}`}
            aria-label={`See details for ${project.title}`}
            className={classes.link}
          >
            <InfoIcon className="inline-block h-4 w-4" />
            <span>Details</span>
            <span className="sr-only"> for {project.title}</span>
          </a>
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

const ProjectCard: ProjectCardComponent = ({ project }) => {
  if (project.slug in projectCardMap) {
    const SpecialCard = projectCardMap[project.slug]!
    return (
      <Suspense fallback={<DefaultProjectCard project={project} />}>
        <SpecialCard project={project} />
      </Suspense>
    )
  }

  return <DefaultProjectCard project={project} />
}

export default ProjectCard
