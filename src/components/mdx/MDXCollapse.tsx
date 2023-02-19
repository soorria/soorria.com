import { children, For, ParentComponent, splitProps } from 'solid-js'

import Collapse, { CollapseProps } from '../Collapse'

const MDXCollapse: ParentComponent<CollapseProps> = props => {
  const [, rest] = splitProps(props, ['children'])
  return (
    <Collapse {...rest}>
      <For each={children(() => props.children).toArray()}>
        {child => <div class="collapse-child">{child}</div>}
      </For>
    </Collapse>
  )
}

export default MDXCollapse
