import { WorkFrontMatter } from '@/types/work'
import { ReactNode } from 'react'

type WorkItemProps = Omit<WorkFrontMatter, 'slug' | 'short_description'> & {
  short_description?: ReactNode
}

const WorkItem: React.FC<WorkItemProps> = ({
  title,
  company,
  location,
  from,
  to,
  short_description,
}) => (
  <div className="flex flex-col space-y-2">
    <div className="flex-grow text-xl font-bold text-drac-pink font-display">{title}</div>
    <div className="flex flex-col justify-between space-y-2 text-sm sm:space-y-0 sm:flex-row sm:col-span-2">
      <div>
        {company} &mdash; {location}
      </div>
      <div>
        {from} &mdash; {to ?? 'Present'}
      </div>
    </div>
    {short_description && <div>{short_description}</div>}
  </div>
)

export default WorkItem
