import Link from 'next/link'
import { ReactNode } from 'react'
import Container from './Container'
import { HeartIcon } from './icons'

type LinkType = {
  href: string
  key?: string
} & ({ title: string } | { title: ReactNode; key: string })

const LINKS: LinkType[][] = [
  [
    {
      title: 'home',
      key: 'home',
      href: '/',
    },
    {
      title: 'about',
      href: '/about',
    },
    {
      title: 'resume',
      key: 'resume',
      href: '/',
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
    {
      title: 'posts',
      href: '/posts',
    },
  ],
  [
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>GitHub</span>
        </span>
      ),
      key: 'github',
      href: 'https://github.com/mo0th',
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Email</span>
        </span>
      ),
      key: 'email',
      href: 'mailto:soorria.ss@gmail.com',
    },
    {
      title: (
        <span className="inline-flex items-center space-x-1">
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
          <span>linkedin</span>
        </span>
      ),
      key: 'linkedin',
      href: 'https://www.linkedin.com/in/soorria/',
    },
  ],
]

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Container>
      <footer className="flex flex-col py-8 space-y-8 border-t border-drac-curr">
        <div className="text-center">
          Made with{' '}
          <span className="relative inline-block w-5 h-5 align-middle group">
            <HeartIcon className="absolute inset-0 fill-current text-drac-pink" />
            <HeartIcon className="absolute inset-0 fill-current text-drac-purple group-hover:animate-ping" />
          </span>{' '}
          by Soorria
        </div>
        <div className="grid justify-around w-full max-w-sm grid-cols-1 gap-4 mx-auto text-center lowercase sm:grid-cols-3">
          {LINKS.map((col, i) => (
            <div key={i} className="flex flex-col w-32 mx-auto space-y-4">
              {col.map(({ title, href, key }) =>
                href.match(/^(mailto|http)/i) ? (
                  <a
                    key={key ?? (title as string)}
                    className="transition-colors hover:text-drac-purple text-drac-comment"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {title}
                  </a>
                ) : (
                  <Link href={href} key={key ?? (title as string)}>
                    <a className="transition-colors hover:text-drac-purple text-drac-comment">
                      {title}
                    </a>
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
