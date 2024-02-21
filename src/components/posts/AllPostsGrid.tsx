import type { AllPostsItem } from '~/lib/data'
import cx from '~/utils/cx'
import SnippetCard from './SnippetCard'
import BlogPostCard from './BlogPostCard'
import type { CSSProperties } from 'react'

type AllPostsGridProps = {
  posts: AllPostsItem[]
  style?: CSSProperties
}

const AllPostsGrid = ({ posts, style }: AllPostsGridProps) => {
  return (
    <div>
      <div
        style={style}
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
  )
}

export default AllPostsGrid
