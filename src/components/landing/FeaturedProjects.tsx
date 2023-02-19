import { For, VoidComponent } from 'solid-js'
import { A } from 'solid-start'

import ProjectCard from '~/components/projects/ProjectCard'
import type { ProjectFrontMatter } from '~/types/project'

import ProjectsGrid from '../projects/ProjectsGrid'
import LandingSection from './LandingSection'

interface FeaturedProjectsProps {
  projects: ProjectFrontMatter[]
  random?: number
}

const titles = ["What I've built", "Stuff I've made", 'Projects']

const FeaturedProjects: VoidComponent<FeaturedProjectsProps> = props => {
  return (
    <LandingSection id="projects" title={titles[(props.random ?? 0) % titles.length]}>
      <ProjectsGrid>
        <For each={props.projects}>{project => <ProjectCard project={project} />}</For>
      </ProjectsGrid>
      <div class="mt-8 text-center">
        <A
          href="/projects"
          class="focus-ring rounded px-3 py-2 text-drac-pink transition-colors hocus:bg-drac-base-light hocus:text-drac-purple"
        >
          <span>See All Projects</span>
        </A>
      </div>
    </LandingSection>
  )
}

export default FeaturedProjects
