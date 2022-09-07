import type { ReactNode } from 'react'
import { links } from '@/links'
import Link from 'next/link'
import Container from './Container'
import { EmailIcon, GithubIconSolid, LinkedinIconSolid } from './icons'
import MadeBy from './MadeBy'

type LinkType = {
  href: string
  key?: string
} & ({ title: string } | { title: ReactNode; key: string })

const LINKS: LinkType[][] = [
  [
    {
      title: 'home',
      href: '/',
    },
    // {
    //   title: 'about',
    //   href: '/about',
    // },
    {
      title: '/uses',
      href: '/uses',
    },
    {
      title: 'source',
      href: 'https://soorria.com/src',
    },
  ],
  [
    {
      title: 'projects',
      href: '/projects',
    },
    {
      title: 'snippets',
      href: '/snippets',
    },
  ],
  [
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <GithubIconSolid className="h-3 w-3" />
          <span>soorria</span>
        </span>
      ),
      key: 'github',
      href: links.github.href,
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <EmailIcon className="h-3 w-3" />
          <span>email</span>
        </span>
      ),
      key: 'email',
      href: links.email.href,
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <LinkedinIconSolid className="h-3 w-3" />
          <span>soorria</span>
        </span>
      ),
      key: 'linkedin',
      href: links.linkedin.href,
    },
  ],
]

const linkClass = 'transition-colors text-drac-pink hocus:text-drac-purple focus-ring rounded'

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Container>
      <footer className="flex flex-col space-y-8 border-t border-drac-curr pt-8 pb-10">
        <MadeBy />
        <div className="mx-auto grid max-w-sm grid-cols-1 justify-center gap-4 text-center lowercase sm:grid-cols-3">
          {LINKS.map((col, i) => (
            <div key={i} className="mx-auto flex w-32 flex-col space-y-4">
              {col.map(({ title, href, key }) =>
                href.match(/^(mailto|http)/i) ? (
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
                  <Link href={href} key={key ?? (title as string)}>
                    <a className={linkClass}>{title}</a>
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
