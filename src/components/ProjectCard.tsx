import { ProjectFrontMatter } from '@/types/project'
import Link from 'next/link'
import { CodeIcon, ExternalIcon, InfoIcon } from './icons'

interface ProjectCardProps {
  project: ProjectFrontMatter
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="flex flex-col space-y-3">
      <div className="text-xl font-bold text-drac-pink font-display">{project.title}</div>
      <div className="flex-1">{project.short_description}</div>
      <div>
        <div className="flex flex-wrap -mt-1 -ml-2 text-xs text-opacity-80 text-drac-fg">
          {project.stack.map(tech => (
            <span key={tech} className="mt-1 ml-2">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-4 text-sm">
        {/* <Link href={`/projects/${project.slug}`}>
          <a
            aria-label={`See details for ${project.title}`}
            className="inline-flex items-center space-x-1 underline text-drac-pink hover:text-drac-purple"
          >
            <InfoIcon className="inline-block w-4 h-4" />
            <span>Details</span>
          </a>
        </Link> */}

        {project.live && (
          <a
            href={project.live}
            aria-label={`View the live site for ${project.title}`}
            className="inline-flex items-center space-x-1 underline text-drac-pink hover:text-drac-purple"
          >
            <ExternalIcon className="inline-block w-4 h-4" />
            <span>View Live</span>
          </a>
        )}

        {project.source && (
          <a
            href={project.source}
            aria-label={`View the source code for ${project.title}`}
            className="inline-flex items-center space-x-1 underline text-drac-pink hover:text-drac-purple"
          >
            <CodeIcon className="inline-block w-4 h-4" />
            <span>Source</span>
          </a>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
