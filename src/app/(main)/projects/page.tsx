import type { ProjectFrontMatter } from '~/types/project'
import PostLayout from '~/components/posts/PostLayout'
import ProjectCard from '~/components/projects/ProjectCard'
import ProjectsGrid from '~/components/projects/ProjectsGrid'
import { featuredProjects, PUBLIC_URL } from '~/constants'
import { getAllFilesFrontMatter } from '~/lib/data'
import { DataType } from '~/types/data'
import { getOgImageForData } from '~/utils/og'

const description = "Things I've made. Some are more useful and cooler than others."
const title = 'Projects'
const url = `${PUBLIC_URL}/projects`

export const metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,

    description,
    type: 'website',
    url,
    images: [getOgImageForData(DataType.projects)],
  },
}

const ProjectsPage = async () => {
  const aboveFold = [...featuredProjects, 'aqrm', 'wordle-score', 'slidy', 'fight-for-tribeland']
  const projectOrder = [...aboveFold]
  const getProjectIndex = (slug: string): number => {
    const idx = projectOrder.indexOf(slug)
    return idx >= 0 ? idx : projectOrder.length + 10
  }

  const projects = (await getAllFilesFrontMatter<ProjectFrontMatter>(DataType.projects)).sort(
    (a, b) => getProjectIndex(a.slug) - getProjectIndex(b.slug)
  )
  const numMainProjects = aboveFold.length

  return (
    <PostLayout title="Projects">
      <p className="mb-12 mt-6 text-center text-lg">{description}</p>
      <ProjectsGrid>
        {projects.slice(0, numMainProjects).map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
      <h2 className="mb-8 mt-16 text-4xl">Other Projects</h2>
      <ProjectsGrid>
        {projects.slice(numMainProjects).map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
    </PostLayout>
  )
}

export default ProjectsPage
