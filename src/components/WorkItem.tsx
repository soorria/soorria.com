import { WorkFrontMatter } from '@/types/work'
import { ReactNode } from 'react'

type WorkItemProps = Omit<WorkFrontMatter, 'slug' | 'shortDescription' | 'hasContent'> & {
  shortDescription?: ReactNode
}

const WorkItem: React.FC<WorkItemProps> = ({
  title,
  company,
  location,
  from,
  to,
  shortDescription,
  techUsed,
}) => (
  <div className="flex flex-col space-y-2">
    <div className="grow font-display text-xl font-bold text-drac-pink">{title}</div>
    <div className="flex flex-col justify-between space-y-2 text-sm sm:col-span-2 sm:flex-row sm:space-y-0">
      <div>
        {company} &mdash; {location}
      </div>
      <div>
        {from} &mdash; {to ?? 'Present'}
      </div>
    </div>
    {shortDescription && <div>{shortDescription}</div>}
    {techUsed?.length ? (
      <div className="-mt-1 -ml-2 inline-flex flex-wrap text-xs text-drac-fg text-opacity-80">
        {techUsed.map(tech => (
          <span key={tech} className="mt-1 ml-2">
            {tech}
          </span>
        ))}
      </div>
    ) : null}
  </div>
)

export default WorkItem
