import Container from '@/components/Container'
import { PostHeading } from '@/components/PostLayout'

interface ProjectsPageProps {}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  return (
    <Container>
      <div className="py-8">
        <PostHeading>Projects</PostHeading>
      </div>
    </Container>
  )
}

export default ProjectsPage
