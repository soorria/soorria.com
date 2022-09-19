import type { PostFrontMatter } from '@/types/post'
import Link from 'next/link'
import { BookIcon, ClockIconSolid, EditIcon, TextIcon } from '@/components/icons'
import { formatDate } from '@/utils/date'
import cx from '@/utils/cx'

const SnippetCard: React.FC<{ post: PostFrontMatter }> = ({
  post: { slug, title, shortDescription, createdAt, updatedAt, readingTime, words },
}) => (
  <Link href={`/blog/${slug}`} passHref>
    <a className="group relative overflow-hidden rounded-xl bg-drac-base-light px-4 py-4 ring-drac-pink transition-shadow hover:shadow-2xl focus:ring-2 md:py-6 md:px-8">
      <div className="relative z-10 flex h-full flex-col space-y-4">
        <div className="font-display text-2xl font-bold text-drac-pink group-hover:underline sm:text-2xl">
          {title}
        </div>
        <div className="flex-1 text-sm sm:text-base">{shortDescription}</div>
        <hr className="my-2 border-drac-content/10" />
        <div className="grid grid-cols-2 items-center justify-items-center gap-4 text-xs sm:grid-cols-4">
          <div className="flex items-center space-x-2">
            <BookIcon className="inline-block h-3 w-3" />
            <span>{readingTime}</span>
          </div>

          <div className="flex items-center space-x-2">
            <TextIcon className="inline-block h-3 w-3" />
            <span>{words}</span>
          </div>

          <div
            className={cx(
              'flex items-center space-x-2',
              updatedAt ? '' : 'pointer-events-none opacity-0'
            )}
          >
            <EditIcon className="inline-block h-3 w-3" />
            <span>{updatedAt ? formatDate(updatedAt) : 'UNCHANGED'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <ClockIconSolid className="inline-block h-3 w-3" />
            <span>{createdAt ? formatDate(createdAt) : 'UNPUBLISHED'}</span>
          </div>
        </div>
      </div>
    </a>
  </Link>
)

export default SnippetCard
