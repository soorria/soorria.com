import { JSXElement, ParentComponent, ValidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { TriangleIcon } from './icons'

export type CollapseProps = {
  summary: JSXElement
  summaryComponent?: ValidComponent
}

const Collapse: ParentComponent<CollapseProps> = props => {
  return (
    <details class="group list-none space-y-8 rounded bg-drac-base-dark p-4 transition-shadow">
      <summary class="not-prose focus-ring -m-4 flex cursor-pointer list-none appearance-none items-center space-x-4 rounded p-4 [&::-webkit-details-marker]:hidden">
        <TriangleIcon class="h-3 w-3 rotate-90 fill-white text-white transition-transform group-open:rotate-180" />
        <Dynamic
          component={props.summaryComponent ?? 'h2'}
          class="ml-1 inline-block font-display font-bold"
        >
          {props.summary}
        </Dynamic>
      </summary>

      {props.children}
    </details>
  )
}

export default Collapse
