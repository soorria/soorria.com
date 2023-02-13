import { ParentComponent } from 'solid-js'
import Container from './Container'

type PostLayoutProps = {
  title: string
}

export const PostHeading: ParentComponent = props => {
  return (
    <h1 class="mt-0 mb-20 break-words text-center text-5xl !leading-tight text-drac-pink sm:mt-8 sm:text-6xl md:text-7xl">
      {props.children}
    </h1>
  )
}

export const PostBottomSection: ParentComponent = ({ children }) => {
  return <div class="mx-auto mt-24 max-w-xs space-y-8 text-center text-sm">{children}</div>
}

const PostLayout: ParentComponent<PostLayoutProps> = ({ title, children }) => {
  return (
    <Container>
      <article class="space-y-12 pt-8 pb-16">
        <PostHeading>{title}</PostHeading>
        {children}
      </article>
    </Container>
  )
}

export default PostLayout
