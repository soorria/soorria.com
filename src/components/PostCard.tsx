import Link from 'next/link'
import { format } from 'date-fns'
import { ClockIconSolid, EditIcon } from '@/components/icons'
import { PostFrontMatter } from '@/types/post'

const SnippetCard: React.FC<{ post: PostFrontMatter }> = ({
  post: { slug, title, shortDescription, createdAt, updatedAt },
}) => (
  <Link href={`/blog/${slug}`} passHref>
    <a className="relative px-4 py-3 overflow-hidden transition-shadow rounded-xl md:py-6 md:px-8 bg-drac-curr hover:shadow-2xl group focus:ring-2 ring-drac-pink">
      <div className="relative z-10 flex flex-col h-full space-y-3">
        <div className="text-xl font-bold text-drac-pink font-display group-hover:underline">
          {title}
        </div>
        <div className="flex-1">{shortDescription}</div>
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <ClockIconSolid className="inline-block w-4 h-4" />
            <span>{format(new Date(createdAt), 'dd/MM/yy')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <EditIcon className="inline-block w-4 h-4" />
            <span>{format(new Date(updatedAt), 'dd/MM/yy')}</span>
          </div>
        </div>
      </div>
    </a>
  </Link>
)

export default SnippetCard
