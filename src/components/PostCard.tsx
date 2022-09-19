import type { PostFrontMatter } from '@/types/post'
import Link from 'next/link'
import { BookIcon, ClockIconSolid, EditIcon, TextIcon } from '@/components/icons'
import { formatDate } from '@/utils/date'

const SnippetCard: React.FC<{ post: PostFrontMatter }> = ({
  post: { slug, title, shortDescription, createdAt, updatedAt, readingTime, words },
}) => (
  <Link href={`/blog/${slug}`} passHref>
    <a className="group relative overflow-hidden rounded-xl bg-drac-base-light px-4 py-3 ring-drac-pink transition-shadow hover:shadow-2xl focus:ring-2 md:py-6 md:px-8">
      <div className="relative z-10 flex h-full flex-col space-y-3">
        <div className="font-display text-xl font-bold text-drac-pink group-hover:underline">
          {title}
        </div>
        <div className="flex-1">{shortDescription}</div>
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <BookIcon className="inline-block h-4 w-4" />
            <span>{readingTime}</span>
          </div>

          <div className="flex items-center space-x-2">
            <TextIcon className="inline-block h-4 w-4" />
            <span>{words}</span>
          </div>

          <div className="flex-1" />

          {updatedAt ? (
            <div className="flex items-center space-x-2">
              <EditIcon className="inline-block h-4 w-4" />
              <span>{formatDate(updatedAt)}</span>
            </div>
          ) : null}

          <div className="flex items-center space-x-2">
            <ClockIconSolid className="inline-block h-4 w-4" />
            <span>{createdAt ? formatDate(createdAt) : 'UNPUBLISHED'}</span>
          </div>
        </div>
      </div>
    </a>
  </Link>
)

export default SnippetCard
