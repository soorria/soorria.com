import Container from '@/components/Container'
import { PostHeading } from '@/components/PostLayout'

interface PostsPageProps {}

const PostsPage: React.FC<PostsPageProps> = () => {
  return (
    <Container>
      <PostHeading>Posts</PostHeading>
    </Container>
  )
}

export default PostsPage
