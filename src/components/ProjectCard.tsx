import { ProjectFrontMatter } from '@/types/project'
import Link from 'next/link'
import { CodeIcon, ExternalIcon, InfoIcon } from './icons'

interface ProjectCardProps {
  project: ProjectFrontMatter
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="flex flex-col">
      <header className="mb-4 text-lg font-bold font-display">{project.title}</header>
      <div className="flex-1 mb-4">{project.short_description}</div>
      <div className="flex flex-wrap mb-4 -mt-1 -ml-2 text-sm text-opacity-80 text-drac-fg">
        {project.stack.map(tech => (
          <span key={tech} className="mt-1 ml-2">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex justify-between text-sm">
        <Link href={`/projects/${project.slug}`} passHref>
          <a className="inline-flex items-center space-x-1 text-drac-pink hover:text-drac-purple">
            <InfoIcon className="inline-block w-4 h-4" />
            <span>Details</span>
          </a>
        </Link>

        {project.source && (
          <a
            href={project.source}
            className="inline-flex items-center space-x-1 text-drac-pink hover:text-drac-purple"
          >
            <CodeIcon className="inline-block w-4 h-4" />
            <span>Source</span>
          </a>
        )}

        <a
          href={project.live}
          className="inline-flex items-center space-x-1 text-drac-pink hover:text-drac-purple"
        >
          <ExternalIcon className="inline-block w-4 h-4" />
          <span>Live Demo</span>
        </a>
      </div>
    </article>
  )
}

export default ProjectCard
