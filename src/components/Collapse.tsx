import type { ElementType, ReactNode } from 'react'
import { TriangleIcon } from './icons'

export interface CollapseProps {
  summary: ReactNode
  summaryComponent?: ElementType
}

const Collapse: React.FC<CollapseProps> = ({
  summary,
  children,
  summaryComponent: SummaryComponent = 'h2',
}) => {
  return (
    <details className="group space-y-8 rounded bg-drac-base-dark p-4 transition-shadow">
      <summary className="not-prose focus-ring -m-4 flex cursor-pointer appearance-none items-center space-x-4 rounded p-4">
        <TriangleIcon className="h-3 w-3 rotate-90 fill-white text-white transition-transform group-open:rotate-180" />
        <SummaryComponent className="ml-1 inline-block font-display font-bold">
          {summary}
        </SummaryComponent>
      </summary>

      {children}
    </details>
  )
}

export default Collapse
