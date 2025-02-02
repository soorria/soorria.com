import type { ElementType, PropsWithChildren, ReactNode } from 'react'
import { TriangleIcon } from './icons'

export type CollapseProps = PropsWithChildren<{
  summary: ReactNode
  summaryComponent?: ElementType
  id?: string
}>

const Collapse: React.FC<CollapseProps> = ({
  summary,
  children,
  summaryComponent: SummaryComponent = 'h2',
  id,
}) => {
  return (
    <details
      className="list-none space-y-8 rounded-sm bg-drac-base-dark p-4 transition-shadow"
      id={id}
    >
      <summary className="not-prose focus-ring -m-4 flex cursor-pointer list-none appearance-none items-center space-x-4 rounded-sm p-4 [&::-webkit-details-marker]:hidden">
        <TriangleIcon className="h-3 w-3 rotate-90 fill-white text-white transition-transform [details[open]>summary>&]:rotate-180" />
        <SummaryComponent className="ml-1 inline-block font-display font-bold">
          {summary}
        </SummaryComponent>
      </summary>

      {children}
    </details>
  )
}

export default Collapse
