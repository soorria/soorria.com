import type { SnippetFrontMatter } from '@/types/snippet'
import Link from 'next/link'
import { ClockIconSolid, EditIcon } from '@/components/icons'
import { categoryLowerCaseToIcon, defaultCategoryIcon } from './categories'
import { formatDate } from '@/utils/date'

const SnippetCard: React.FC<{ snippet: SnippetFrontMatter }> = ({
  snippet: { slug, title, shortDescription, createdAt, updatedAt, category },
}) => {
  const Icon = categoryLowerCaseToIcon[category.toLowerCase()] || defaultCategoryIcon
  return (
    <Link href={`/snippets/${slug}`} passHref>
      <a className="group relative overflow-hidden rounded-xl bg-drac-base-light p-4 ring-drac-pink transition-shadow hover:shadow-2xl focus:outline-none focus:ring md:py-6 md:px-8 md:focus:ring-4">
        <div className="absolute inset-0 flex items-center text-drac-highlight text-opacity-20">
          <div className="h-48 w-48 -translate-x-6 scale-110 group-hocus:-rotate-20 motion-safe:transition-transform">
            <Icon />
          </div>
        </div>
        <div className="relative z-10 flex h-full flex-col space-y-3">
          <div className="font-display text-xl font-bold text-drac-pink group-hover:underline">
            {title}
          </div>
          <div className="min-h-[3rem] flex-1">{shortDescription}</div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <ClockIconSolid className="inline-block h-4 w-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
            {updatedAt && createdAt !== updatedAt ? (
              <div className="flex items-center space-x-2">
                <EditIcon className="inline-block h-4 w-4" />
                <span>{formatDate(updatedAt)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </a>
    </Link>
  )
}

export default SnippetCard
