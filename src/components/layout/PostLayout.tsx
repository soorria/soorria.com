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

export const PostBottomSection: ParentComponent = props => {
  return <div class="mx-auto mt-24 max-w-xs space-y-8 text-center text-sm">{props.children}</div>
}

const PostLayout: ParentComponent<PostLayoutProps> = props => {
  return (
    <Container>
      <article class="space-y-12 pt-8 pb-16">
        <PostHeading>{props.title}</PostHeading>
        {props.children}
      </article>
    </Container>
  )
}

export default PostLayout
