import PostLayout from '~/components/posts/PostLayout'
import { getAllPosts, sortPostsForRender } from '~/lib/data'
import { getOgImageForData } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'
import AllPostsGrid from '~/components/posts/AllPostsGrid'

const description = "All the stuff I've written on this site"
const title = 'All Posts'
const url = `${PUBLIC_URL}/all-posts`

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
    images: [getOgImageForData('snippets')],
  },
}

const SnippetsPage = async () => {
  const posts = sortPostsForRender(await getAllPosts())

  return (
    <PostLayout title="All Posts" description={description}>
      <AllPostsGrid
        posts={posts}
        style={{
          '--initial-step': '2',
        }}
      />

      <div className="my-12 text-center" style={{ '--step-num': (posts.length + 3).toString() }}>
        {posts.length} posts total
      </div>
    </PostLayout>
  )
}

export default SnippetsPage
