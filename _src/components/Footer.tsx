import type { ReactNode } from 'react'
import { links } from '~/links'
import Link from 'next/link'
import Container from './Container'
import MadeBy from './MadeBy'

type LinkType = {
  href: string
  key?: string
  ext?: boolean
} & ({ title: string } | { title: ReactNode; key: string })

const LINKS: LinkType[][] = [
  [
    {
      title: 'home',
      href: '/',
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
      title: 'blog',
      href: '/blog',
    },
    {
      title: 'all posts',
      href: '/all-posts',
    },
  ],
  [
    {
      title: 'about',
      href: '/about',
    },
    {
      title: '/uses',
      href: '/uses',
    },
    {
      title: 'source',
      href: '/src',
      ext: true,
    },
    {
      title: 'stats',
      href: '/stats',
      ext: true,
    },
  ],
  [
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <links.github.icon aria-label="github" className="h-3 w-3" />
          <span>soorria</span>
        </span>
      ),
      key: 'github',
      href: links.github.href,
      ext: true,
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <links.email.icon aria-label="email" className="h-3 w-3" />
          <span>email</span>
        </span>
      ),
      key: 'email',
      href: links.email.href,
      ext: true,
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <links.linkedin.icon aria-label="linkedin" className="h-3 w-3" />
          <span>soorria</span>
        </span>
      ),
      key: 'linkedin',
      href: links.linkedin.href,
      ext: true,
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <links.card.icon className="h-3 w-3" />
          <span>all links</span>
        </span>
      ),
      key: 'all-links',
      href: links.card.href,
      ext: true,
    },
  ],
]

const linkClass = 'transition-colors text-drac-pink hocus:text-drac-purple focus-ring rounded'

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Container>
      <footer className="flex flex-col space-y-8 border-t border-drac-base-light pt-8 pb-10">
        <div className="mx-auto w-full max-w-sm">
          <MadeBy />
        </div>
        <div className="mx-auto grid max-w-sm grid-cols-1 justify-center gap-4 text-center lowercase sm:grid-cols-3">
          {LINKS.map((col, i) => (
            <div key={i} className="mx-auto flex w-32 flex-col space-y-4">
              {col.map(({ title, href, key, ext }) =>
                ext ? (
                  <a
                    key={key ?? (title as string)}
                    className={linkClass}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {title}
                  </a>
                ) : (
                  <Link href={href} key={key ?? (title as string)} className={linkClass}>
                    {title}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </footer>
    </Container>
  )
}

export default Footer
