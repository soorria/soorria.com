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
        className="focus-ring fixed left-1/2 z-50 mx-auto block -translate-y-full -translate-x-1/2 transform rounded bg-drac-bg px-4 py-2 font-display font-bold text-drac-pink transition-transform focus:translate-y-2 focus:ring-2 hocus:shadow-xl"
      >
        Skip to Main Content
      </a>
      <header className="flex items-center justify-between py-8">
        <SpinnyHomeLink />
        <nav className="flex space-x-1 font-display sm:space-x-3 sm:text-lg">
          {LINKS.map(({ title, href }) => (
            <Link key={href} href={href} passHref>
              <a className="focus-ring relative overflow-hidden rounded border-drac-fg px-2 py-1 leading-none transition hocus:bg-drac-curr hocus:text-drac-pink sm:py-2 sm:px-3">
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
