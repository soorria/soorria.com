import { ProjectFrontMatter } from '@/types/project'
import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'
import LandingSection from './LandingSection'
import ProjectsGrid from '../projects/ProjectsGrid'

interface FeaturedProjectsProps {
  projects: ProjectFrontMatter[]
  random?: number
}

const titles = ["What I've Built", "Stuff I've Made", 'Projects']

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, random = 0 }) => {
  return (
    <LandingSection id="projects" title={titles[random % titles.length]}>
      <ProjectsGrid>
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
      <div className="mt-8 text-center">
        <Link href="/projects" passHref>
          <a className="px-3 py-2 transition-colors rounded text-drac-pink hover:text-drac-purple hover:bg-drac-curr">
            <span>See All Projects</span>
          </a>
        </Link>
      </div>
    </LandingSection>
  )
}

export default FeaturedProjects
