import ProjectCard, { type ProjectCardProps } from '~/components/projects/ProjectCard'
import LandingSection from './LandingSection'
import ProjectsGrid from '../projects/ProjectsGrid'

interface FeaturedProjectsProps {
  projects: ProjectCardProps['project'][]
  random?: number
}

const titles = ["What I've Built", "Stuff I've Made", 'Projects']

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, random = 0 }) => {
  return (
    <LandingSection
      className="slide-in"
      style={{
        '--initial-step': '3',
      } as React.CSSProperties}
      id="projects"
      title={titles[random % titles.length]}
    >
      <ProjectsGrid initialStep="3">
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
      <div className="mt-8 text-center">
        <a
          href="/projects"
          className="focus-ring rounded-sm px-3 py-2 text-drac-pink transition-colors hocus:bg-drac-base-light hocus:text-drac-purple"
        >
          <span>See All Projects</span>
        </a>
      </div>
    </LandingSection>
  )
}

export default FeaturedProjects
