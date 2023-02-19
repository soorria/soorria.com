import { ParentComponent } from 'solid-js'

import Container from './Container'

const MainLayout: ParentComponent = props => {
  return (
    <Container>
      <div class="py-8">{props.children}</div>
    </Container>
  )
}

export default MainLayout
