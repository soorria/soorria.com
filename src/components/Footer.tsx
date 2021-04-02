import Link from 'next/link'
import Container from './Container'
import { HeartIcon } from './icons'

const LINKS = [
  {
    title: 'about',
    href: '/about',
  },
  {
    title: 'resume',
    href: '#',
  },
  {
    title: 'projects',
    href: '/projects',
  },
  {
    title: 'snippets',
    href: '/snippets',
  },
  {
    title: 'posts',
    href: '/posts',
  },
  {
    title: 'GitHub',
    href: 'https://github.com/mo0th',
    isExternal: true,
  },
]

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Container>
      <footer className="py-8 border-t border-drac-curr">
        <div className="text-center">
          Made with{' '}
          <span className="relative inline-block w-5 h-5 align-middle group">
            <HeartIcon className="absolute inset-0 fill-current text-drac-pink" />
            <HeartIcon className="absolute inset-0 fill-current text-drac-purple group-hover:animate-ping" />
          </span>{' '}
          by Soorria
        </div>
        <div className="grid justify-between max-w-sm grid-cols-2 gap-4 mx-auto mt-8 text-center sm:grid-cols-3">
          {LINKS.map(({ title, href, isExternal }) =>
            isExternal ? (
              <a
                key={title}
                className="transition-colors hover:text-drac-purple text-drac-comment"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            ) : (
              <Link href={href} key={href}>
                <a className="transition-colors hover:text-drac-purple text-drac-comment">
                  {title}
                </a>
              </Link>
            )
          )}
        </div>
      </footer>
    </Container>
  )
}

export default Footer
