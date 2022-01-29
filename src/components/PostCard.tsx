import Link from 'next/link'
import { format } from 'date-fns'
import { ClockIconSolid, EditIcon } from '@/components/icons'
import { PostFrontMatter } from '@/types/post'

const SnippetCard: React.FC<{ post: PostFrontMatter }> = ({
  post: { slug, title, shortDescription, createdAt, updatedAt },
}) => (
  <Link href={`/blog/${slug}`} passHref>
    <a className="group relative overflow-hidden rounded-xl bg-drac-curr px-4 py-3 ring-drac-pink transition-shadow hover:shadow-2xl focus:ring-2 md:py-6 md:px-8">
      <div className="relative z-10 flex h-full flex-col space-y-3">
        <div className="font-display text-xl font-bold text-drac-pink group-hover:underline">
          {title}
        </div>
        <div className="flex-1">{shortDescription}</div>
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <ClockIconSolid className="inline-block h-4 w-4" />
            <span>{createdAt ? format(new Date(createdAt), 'dd/MM/yy') : 'UNPUBLISHED'}</span>
          </div>
          {updatedAt ? (
            <div className="flex items-center space-x-2">
              <EditIcon className="inline-block h-4 w-4" />
              <span>{format(new Date(updatedAt), 'dd/MM/yy')}</span>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  </Link>
)

export default SnippetCard
