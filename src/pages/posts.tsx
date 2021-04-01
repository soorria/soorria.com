import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'

interface PostsPageProps {}

const PostsPage: React.FC<PostsPageProps> = () => {
  return (
    <MainLayout>
      <PostHeading>Posts</PostHeading>
    </MainLayout>
  )
}

export default PostsPage
