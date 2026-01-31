import type { PropsWithChildren } from 'react'

type PostListItemLinkProps = PropsWithChildren<{
  href: string
}>

const PostListItemLink: React.FC<PostListItemLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-xl bg-drac-base-light p-4 ring-drac-pink transition-shadow focus:outline-hidden focus:ring-3 hocus:shadow-2xl md:px-8 md:py-6 md:focus:ring-4"
    >
      {children}
    </a>
  )
}

export default PostListItemLink
