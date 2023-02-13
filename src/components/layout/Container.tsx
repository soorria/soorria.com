import { ParentComponent } from 'solid-js'

const Container: ParentComponent = props => {
  return <div class="container mx-auto max-w-4xl px-4 md:px-8">{props.children}</div>
}

export default Container
