import type { GetStaticProps } from 'next'
import type { ProjectFrontMatter } from '@/types/project'
import PostLayout from '@/components/PostLayout'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import { featuredProjects } from '@/constants'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import { getOgImage } from '@/utils/og'
import { NextSeo } from 'next-seo'

interface ProjectsPageProps {
  projects: ProjectFrontMatter[]
  numMainProjects: number
}

const description = "Things I've made. Some are more useful and cooler than others."
const title = 'Projects'
const url = 'https://mooth.tech/projects'

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, numMainProjects }) => {
  return (
    <PostLayout title="Projects">
      <NextSeo
        description={description}
        title={title}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImage(DataType.projects)],
        }}
      />
      <p className="mt-6 mb-12 text-center text-lg">{description}</p>
      <ProjectsGrid>
        {projects.slice(0, numMainProjects).map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
      <h2 className="mt-16 mb-8 text-4xl">Other Projects</h2>
      <ProjectsGrid>
        {projects.slice(numMainProjects).map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
    </PostLayout>
  )
}

export default ProjectsPage

const projectOrder = [...featuredProjects, 'aqrm', 'sizes']
const getProjectIndex = (slug: string): number => {
  const idx = projectOrder.indexOf(slug)
  return idx >= 0 ? idx : projectOrder.length + 10
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const projects = (await getAllFilesFrontMatter<ProjectFrontMatter>(DataType.projects)).sort(
    (a, b) => getProjectIndex(a.slug) - getProjectIndex(b.slug)
  )

  return {
    props: { projects, numMainProjects: featuredProjects.length },
  }
}
