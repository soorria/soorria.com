import ProjectCard from '~/lib/ui/projects/ProjectCard'
import LandingSection from './LandingSection'
import ProjectsGrid from '~/lib/ui/projects/ProjectsGrid'
import type { ProjectFrontMatter } from '~/lib/data/types'

interface FeaturedProjectsProps {
  projects: ProjectFrontMatter[]
  random?: number
}

const titles = ["What I've Built", "Stuff I've Made", 'Projects']

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, random = 0 }) => {
  return (
    <LandingSection
      className="slide-in"
      style={{
        '--initial-step': '3',
      }}
      id="projects"
      title={titles[random % titles.length]}
    >
      <ProjectsGrid initialStep="3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectsGrid>
      <div className="mt-8 text-center">
        <a
          href="/projects"
          className="focus-ring text-drac-pink hocus:bg-drac-base-light hocus:text-drac-purple rounded-sm px-3 py-2 transition-colors"
        >
          <span>See All Projects</span>
        </a>
      </div>
    </LandingSection>
  )
}

export default FeaturedProjects
