import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'

interface ProjectsPageProps {}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  return (
    <MainLayout>
      <PostHeading>Projects</PostHeading>
    </MainLayout>
  )
}

export default ProjectsPage
