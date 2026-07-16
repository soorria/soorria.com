'use client'

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
  {
    title: <span className="header-art-link-text">art</span>,
    href: '/authentic-artistique-endevours',
  },
]

const Header: React.FC = () => {
  return (
    <Container className="relative z-10">
      <header className="slide-in-direct flex items-center justify-between py-8">
        <SpinnyHomeLink />
        <nav className="flex space-x-1 font-display sm:space-x-3 sm:text-lg">
          {LINKS.map(({ title, href }) => (
            <a
              key={href}
              href={href}
              className="focus-ring group relative overflow-hidden rounded-sm border-drac-content px-2 py-1 leading-none transition hocus:bg-drac-base-light hocus:text-drac-pink sm:px-3 sm:py-2"
            >
              {title}
            </a>
          ))}
        </nav>
      </header>
    </Container>
  )
}

export default Header
