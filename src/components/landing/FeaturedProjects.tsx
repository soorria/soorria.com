import { ProjectFrontMatter } from '@/types/project'
import Link from 'next/link'
import ProjectCard from '../ProjectCard'
import LandingSection from './LandingSection'

interface FeaturedProjectsProps {
  projects: ProjectFrontMatter[]
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <LandingSection title="Projects">
      <div className="grid grid-cols-1 gap-12 mb-8 sm:grid-cols-2">
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <div className="text-center">
        <Link href="/projects" passHref>
          <a className="text-drac-pink hover:text-drac-purple">
            <span>See All Projects</span>
          </a>
        </Link>
      </div>
    </LandingSection>
  )
}

export default FeaturedProjects
