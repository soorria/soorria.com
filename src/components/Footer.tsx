import { links } from '@/links'
import Link from 'next/link'
import { ReactNode } from 'react'
import Container from './Container'
import { EmailIcon, GithubIconSolid, HeartIcon, LinkedinIconSolid } from './icons'

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
    {
      title: 'about',
      href: '/about',
    },
    {
      title: '/uses',
      href: '/uses',
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
          <span>mo0th</span>
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

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Container>
      <footer className="flex flex-col space-y-8 border-t border-drac-curr pt-8 pb-10">
        <div className="group text-center">
          Made with{' '}
          <span className="relative inline-block h-5 w-5 align-middle">
            <HeartIcon className="absolute inset-0 fill-current text-drac-pink" />
            <HeartIcon className="absolute inset-0 fill-current text-drac-purple group-hover:animate-ping" />
          </span>{' '}
          by Soorria
        </div>
        <div className="mx-auto grid max-w-sm grid-cols-1 justify-center gap-4 text-center lowercase sm:grid-cols-3">
          {LINKS.map((col, i) => (
            <div key={i} className="mx-auto flex w-32 flex-col space-y-4 text-drac-purple">
              {col.map(({ title, href, key }) =>
                href.match(/^(mailto|http)/i) ? (
                  <a
                    key={key ?? (title as string)}
                    className="transition-colors"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {title}
                  </a>
                ) : (
                  <Link href={href} key={key ?? (title as string)}>
                    <a className="transition-colors">{title}</a>
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
