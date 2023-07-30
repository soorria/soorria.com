import type { SnippetFrontMatter } from '~/types/snippet'
import PostLayout from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter } from '~/lib/data'
import SnippetCard from '~/components/posts/SnippetCard'
import BlogPostCard from '~/components/posts/BlogPostCard'
import { getOgImageForData } from '~/utils/og'
import { blogPostFilter, sortByCreatedAtField } from '~/utils/content'
import { PUBLIC_URL } from '~/constants'
import type { BlogPostFrontMatter } from '~/types/blog-post'
import cx from '~/utils/cx'

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
  const [snippets, blogPosts] = await Promise.all([
    getAllFilesFrontMatter<SnippetFrontMatter>('snippets'),
    getAllFilesFrontMatter<BlogPostFrontMatter>('blog'),
  ])

  const _posts = sortByCreatedAtField([
    ...snippets.map(s => ({ ...s, type: 'snippets' as const })),
    ...blogPostFilter(blogPosts).map(p => ({ ...p, type: 'blog' as const })),
  ]).map(p => ({ ...p, width: p.type === 'snippets' ? 1 : 2 }))

  // Reorder posts so that they match the order when rendered
  // with `grid-auto-flow: dense`
  const posts: typeof _posts = []
  let buffer: (typeof _posts)[number] | null = null
  for (const post of _posts) {
    if (post.width === 1) {
      if (buffer) {
        posts.push(buffer)
        buffer = null
        posts.push(post)
      } else {
        buffer = post
      }
    } else {
      posts.push(post)
    }
  }
  if (buffer) {
    posts.push(buffer)
  }

  return (
    <PostLayout title="All Posts" description={description}>
      <div>
        <div
          style={{ '--initial-step': '2' }}
          className="slide-in grid auto-cols-min grid-flow-dense grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-x-8 lg:gap-12"
        >
          {posts.map((p, i) => {
            const key = `${p.type}/${p.slug}`

            return (
              <div
                key={key}
                className={cx('grid', p.type === 'snippets' ? 'grid' : 'sm:col-span-2')}
                style={{ '--step-num': (i + 1).toString() }}
              >
                {p.type === 'snippets' ? <SnippetCard snippet={p} /> : <BlogPostCard post={p} />}
              </div>
            )
          })}
        </div>
      </div>
      <div className="my-12 text-center" style={{ '--step-num': (posts.length + 3).toString() }}>
        {posts.length} posts total
      </div>
    </PostLayout>
  )
}

export default SnippetsPage
