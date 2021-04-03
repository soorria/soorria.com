import { ProjectFrontMatter } from '@/types/project'
import ProjectCard from '../ProjectCard'

interface FeaturedProjectsProps {
  projects: ProjectFrontMatter[]
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <section className="my-8">
      <h3 className="mb-8 text-4xl font-bold font-display">Projects</h3>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProjects
