import { ParentComponent } from 'solid-js'

const ProseWrapper: ParentComponent = props => {
  return <div class="prose mx-auto mt-6 mb-12 md:prose-lg">{props.children}</div>
}

export default ProseWrapper
