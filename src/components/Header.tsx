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
  {
    title: 'blog',
    href: '/blog',
  },
]

const Header: React.FC = () => {
  return (
    <Container className="relative z-10">
      <a
        href="#main-content"
        className="focus-ring fixed -top-16 left-1/2 z-50 mx-auto block w-max -translate-x-1/2 transform rounded bg-drac-base px-4 py-2 text-center font-display font-bold text-drac-pink transition-transform focus:translate-y-20 focus:ring-2 hocus:shadow-xl"
      >
        Skip to Main Content
      </a>
      <header className="slide-in-direct flex items-center justify-between py-8">
        <SpinnyHomeLink />
        <nav className="flex space-x-1 font-display sm:space-x-3 sm:text-lg">
          {LINKS.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              passHref
              className="focus-ring relative overflow-hidden rounded border-drac-content px-2 py-1 leading-none transition hocus:bg-drac-base-light hocus:text-drac-pink sm:px-3 sm:py-2"
            >
              {title}
            </Link>
          ))}
        </nav>
      </header>
    </Container>
  )
}

export default Header
