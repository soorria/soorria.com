import type { BlogPostFrontMatter } from '~/types/blog-post'
import PostLayout, { PostHeading } from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter } from '~/lib/data'
import { DataType } from '~/types/data'
import PostCard from '~/components/posts/BlogPostCard'
import MainLayout from '~/components/MainLayout'
import { getOgImageForData } from '~/utils/og'
import { blogPostFilter, sortByCreatedAtField } from '~/utils/content'
import { PUBLIC_URL } from '~/constants'

const description =
  'Attempts at writing about things that I think are interesting, useful, or just cool'
const title = 'Blog'
const url = `${PUBLIC_URL}/blog`

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

    images: [getOgImageForData(DataType.blog)],
  },
}

const PostsPage = async () => {
  const posts = blogPostFilter(
    sortByCreatedAtField(await getAllFilesFrontMatter<BlogPostFrontMatter>(DataType.blog))
  )
  return (
    <PostLayout title="Blog">
      <p className="mb-12 mt-6 text-center text-lg">{description}</p>
      <div>
        <div className="slide-in grid grid-cols-1 gap-8" style={{ '--initial-step': '2' }}>
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <div className="my-12 text-center">{posts.length} ramblings total</div>
    </PostLayout>
  )
}

export default PostsPage
