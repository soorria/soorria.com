import Link from 'next/link'
import Container from './Container'
import SpinnyHomeLink from './SpinnyHomeLink'

const LINKS = [
  {
    title: 'projects',
    href: '/projects',
  },
  {
    title: 'snippets',
    href: '/snippets',
  },
  // {
  //   title: 'blog',
  //   href: '/blog',
  // },
]

const Header: React.FC = () => {
  return (
    <Container>
      <a
        href="#main-content"
        className="font-bold sr-only focus:not-sr-only font-display text-drac-pink"
      >
        Skip to Main Content
      </a>
      <header className="flex items-center justify-between py-8">
        <SpinnyHomeLink />
        <nav className="flex space-x-1 sm:space-x-3 sm:text-lg font-display">
          {LINKS.map(({ title, href }) => (
            <Link key={href} href={href} passHref>
              <a className="relative px-1 py-0.5 sm:py-1 overflow-hidden leading-none transition-colors rounded sm:px-2 border-drac-fg hover:bg-drac-curr hover:text-drac-pink">
                {title}
              </a>
            </Link>
          ))}
        </nav>
      </header>
    </Container>
  )
}

export default Header
