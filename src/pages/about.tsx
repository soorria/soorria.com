import Container from '@/components/Container'
import { PostHeading } from '@/components/PostLayout'

interface AboutPageProps {}

const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <Container>
      <div className="py-8">
        <PostHeading>About Me</PostHeading>
      </div>
    </Container>
  )
}

export default AboutPage
