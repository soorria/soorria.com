import Link from 'next/link'

interface PostListItemLinkProps {
  href: string
}

const PostListItemLink: React.FC<PostListItemLinkProps> = ({ href, children }) => {
  return (
    <Link href={href} passHref>
      <a className="group relative overflow-hidden rounded-xl bg-drac-base-light p-4 ring-drac-pink transition-shadow focus:outline-none focus:ring hocus:shadow-2xl md:py-6 md:px-8 md:focus:ring-4">
        {children}
      </a>
    </Link>
  )
}

export default PostListItemLink
