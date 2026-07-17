import type { ProjectFrontMatter } from '~/types/project'
import ProjectCard from './ProjectCard'
import ProjectsGrid from './ProjectsGrid'

const ProjectsShowcase = ({ projects }: { projects: ProjectFrontMatter[] }) => (
  <ProjectsGrid>
    {projects.map(project => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </ProjectsGrid>
)

export default ProjectsShowcase
