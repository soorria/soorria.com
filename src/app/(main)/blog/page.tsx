import type { BlogPostFrontMatter } from '~/types/blog-post'
import PostLayout from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter } from '~/lib/data'
import PostCard from '~/components/posts/BlogPostCard'
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

    images: [getOgImageForData('blog')],
  },
}

const PostsPage = async () => {
  const posts = blogPostFilter(
    sortByCreatedAtField(await getAllFilesFrontMatter<BlogPostFrontMatter>('blog'))
  )
  return (
    <PostLayout title="Blog" description={description}>
      <div>
        <div className="slide-in grid grid-cols-1 gap-8" style={{ '--initial-step': '2' }}>
          {posts.map(post => (
            // TODO: add --step-num to each item when needed
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <div className="my-12 text-center">{posts.length} ramblings total</div>
    </PostLayout>
  )
}

export default PostsPage
