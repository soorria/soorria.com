import type { PostFrontMatter } from '@/types/post'
import { BookIcon, ClockIconSolid, EditIcon, TextIcon } from '@/components/icons'
import { formatDate } from '@/utils/date'
import PostListItemLink from './posts/PostListItemLink'

const SnippetCard: React.FC<{ post: PostFrontMatter }> = ({
  post: { slug, title, shortDescription, createdAt, updatedAt, readingTime, words },
}) => (
  <PostListItemLink href={`/blog/${slug}`}>
    <div className="relative z-10 flex h-full flex-col space-y-4">
      <div className="font-display text-2xl font-bold text-drac-pink group-hover:underline sm:text-2xl">
        {title}
      </div>
      <div className="flex-1 text-base">{shortDescription}</div>
      <hr className="my-2 border-drac-content/10" />
      <div className="grid grid-cols-2 items-center justify-items-center gap-4 text-sm sm:grid-cols-4">
        <div className="tooltip flex items-center space-x-2" aria-label="Reading time">
          <BookIcon role="presentation" className="inline-block h-3 w-3" />
          <span>{readingTime}</span>
        </div>

        <div className="tooltip flex items-center space-x-2" aria-label="Word cound">
          <TextIcon role="presentation" className="inline-block h-3 w-3" />
          <span>{words}</span>
        </div>

        {updatedAt ? (
          <div className="tooltip flex items-center space-x-2" aria-label="Updated at">
            <EditIcon role="presentation" className="inline-block h-3 w-3" />
            <span>{formatDate(updatedAt)}</span>
          </div>
        ) : null}

        <div
          className="tooltip flex items-center space-x-2"
          style={{ gridColumnEnd: -1 }}
          aria-label="Created at"
        >
          <ClockIconSolid role="presentation" className="inline-block h-3 w-3" />
          <span>{createdAt ? formatDate(createdAt) : 'UNPUBLISHED'}</span>
        </div>
      </div>
    </div>
  </PostListItemLink>
)

export default SnippetCard
