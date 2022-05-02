import type { SnippetFrontMatter } from '@/types/snippet'
import Link from 'next/link'
import { ClockIconSolid, EditIcon } from '@/components/icons'
import { categoryLowerCaseToIcon } from './categories'
import { formatDate } from '@/utils/date'

const SnippetCard: React.FC<{ snippet: SnippetFrontMatter }> = ({
  snippet: { slug, title, shortDescription, createdAt, updatedAt, category },
}) => {
  const Icon =
    categoryLowerCaseToIcon[category.toLowerCase()] || categoryLowerCaseToIcon.miscellaneous
  return (
    <Link href={`/snippets/${slug}`} passHref>
      <a className="group relative overflow-hidden rounded-xl bg-drac-curr p-4 ring-drac-pink transition-shadow hover:shadow-2xl focus:outline-none focus:ring md:py-6 md:px-8 md:focus:ring-4">
        <div className="absolute inset-0 flex items-center text-drac-comment text-opacity-20">
          <div className="h-48 w-48 -translate-x-6 scale-110 transition-transform group-hover:-rotate-20 group-focus:-rotate-12">
            <Icon />
          </div>
        </div>
        <div className="relative z-10 flex h-full flex-col space-y-3">
          <div className="font-display text-xl font-bold text-drac-pink group-hover:underline">
            {title}
          </div>
          <div className="flex-1">{shortDescription}</div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <ClockIconSolid className="inline-block h-4 w-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <EditIcon className="inline-block h-4 w-4" />
              <span>{formatDate(updatedAt)}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default SnippetCard
