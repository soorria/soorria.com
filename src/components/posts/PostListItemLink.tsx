import type { PropsWithChildren } from 'react'

type PostListItemLinkProps = PropsWithChildren<{
  href: string
}>

const PostListItemLink: React.FC<PostListItemLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="group bg-drac-base-light ring-drac-pink hocus:shadow-2xl relative overflow-hidden rounded-xl p-4 transition-shadow focus:ring-3 focus:outline-hidden md:px-8 md:py-6 md:focus:ring-4"
    >
      {children}
    </a>
  )
}

export default PostListItemLink
