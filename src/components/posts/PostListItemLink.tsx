import { ParentComponent } from 'solid-js'
import { A } from 'solid-start'

type PostListItemLinkProps = {
  href: string
}

const PostListItemLink: ParentComponent<PostListItemLinkProps> = props => {
  return (
    <A
      href={props.href}
      class="group relative overflow-hidden rounded-xl bg-drac-base-light p-4 ring-drac-pink transition-shadow focus:outline-none focus:ring hocus:shadow-2xl md:py-6 md:px-8 md:focus:ring-4"
    >
      {props.children}
    </A>
  )
}

export default PostListItemLink
