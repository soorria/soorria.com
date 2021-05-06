import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import { getAllFilesFrontMatter } from '@/lib/data'
import { DataType } from '@/types/data'
import { ProjectFrontMatter } from '@/types/project'
import { getOgImage } from '@/utils/og'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

interface ProjectsPageProps {
  projects: ProjectFrontMatter[]
}

const description = "Things I've made. Some are more useful and cooler than others."
const title = 'Projects'
const url = 'https://mooth.tech/projects'

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  return (
    <MainLayout>
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
      <PostHeading>Projects</PostHeading>
      <p className="mt-6 mb-12 text-lg text-center">{description}</p>
      <ProjectsGrid>
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ProjectsGrid>
    </MainLayout>
  )
}

export default ProjectsPage

const projectOrder = ['jupyter-js', 'not-messenger', 'clinically-relevant', 'mooth-tech']
const getProjectIndex = (slug: string): number => {
  const idx = projectOrder.indexOf(slug)
  return idx >= 0 ? idx : projectOrder.length + 10
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const projects = (await getAllFilesFrontMatter<ProjectFrontMatter>(DataType.projects)).sort(
    (a, b) => getProjectIndex(a.slug) - getProjectIndex(b.slug)
  )

  return {
    props: { projects },
  }
}
