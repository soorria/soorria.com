import Container from '@/components/Container'
import { PostHeading } from '@/components/PostLayout'

interface PostsPageProps {}

const PostsPage: React.FC<PostsPageProps> = () => {
  return (
    <Container>
      <div className="py-8">
        <PostHeading>Posts</PostHeading>
      </div>
    </Container>
  )
}

export default PostsPage
