import { ParentComponent } from 'solid-js'

const ProjectsGrid: ParentComponent = props => {
  return (
    <div class="grid grid-flow-row-dense grid-cols-1 gap-12 sm:grid-cols-2">{props.children}</div>
  )
}

export default ProjectsGrid
