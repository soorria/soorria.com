import { ProjectFrontMatter } from '@/types/project'
import Link from 'next/link'
import { MouseEventHandler } from 'react'
import { CodeIcon, ExternalIcon } from './icons'

interface ProjectCardProps {
  project: ProjectFrontMatter
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const handleInnerLinkClick: MouseEventHandler = event => {
    event.preventDefault()
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <a className="flex flex-col px-4 py-3 space-y-3 transition-shadow rounded-xl md:py-6 md:px-8 bg-drac-curr hover:shadow-2xl group focus:ring-2 ring-drac-pink">
        <div className="text-xl font-bold text-drac-pink font-display group-hover:underline">
          {project.title}
        </div>
        <div className="flex-1">{project.short_description}</div>
        <div>
          <div className="flex flex-wrap -mt-1 -ml-2 text-sm text-opacity-80 text-drac-fg">
            {project.stack.map(tech => (
              <span key={tech} className="mt-1 ml-2">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex space-x-4 text-sm">
          <a
            href={project.live}
            className="inline-flex items-center space-x-1 underline text-drac-pink hover:text-drac-purple"
            onClick={handleInnerLinkClick}
          >
            <ExternalIcon className="inline-block w-4 h-4" />
            <span>Live Demo</span>
          </a>

          {project.source && (
            <a
              href={project.source}
              className="inline-flex items-center space-x-1 underline text-drac-pink hover:text-drac-purple"
              onClick={handleInnerLinkClick}
            >
              <CodeIcon className="inline-block w-4 h-4" />
              <span>Source</span>
            </a>
          )}
        </div>
      </a>
    </Link>
  )
}

export default ProjectCard
