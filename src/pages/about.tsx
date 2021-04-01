import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'

interface AboutPageProps {}

const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <MainLayout>
      <PostHeading>About Me</PostHeading>
    </MainLayout>
  )
}

export default AboutPage
