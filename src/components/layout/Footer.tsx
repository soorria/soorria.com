import { For, JSXElement, VoidComponent } from 'solid-js'
import { A } from 'solid-start'

import { links } from '~/links'

import Container from './Container'
import MadeBy from './MadeBy'

type LinkType = {
  href: string
  key?: string
  ext?: boolean
} & ({ title: string } | { title: () => JSXElement; key: string })

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
      title: () => (
        <span class="inline-flex items-center space-x-1">
          <links.github.icon aria-label="github" class="h-3 w-3" />
          <span>soorria</span>
        </span>
      ),
      key: 'github',
      href: links.github.href,
      ext: true,
    },
    {
      title: () => (
        <span class="inline-flex items-center space-x-1">
          <links.email.icon aria-label="email" class="h-3 w-3" />
          <span>email</span>
        </span>
      ),
      key: 'email',
      href: links.email.href,
      ext: true,
    },
    {
      title: () => (
        <span class="inline-flex items-center space-x-1">
          <links.linkedin.icon aria-label="linkedin" class="h-3 w-3" />
          <span>soorria</span>
        </span>
      ),
      key: 'linkedin',
      href: links.linkedin.href,
      ext: true,
    },
    {
      title: () => (
        <span class="inline-flex items-center space-x-1">
          <links.card.icon class="h-3 w-3" />
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

const Footer: VoidComponent = () => {
  return (
    <Container>
      <footer class="flex flex-col space-y-8 border-t border-drac-base-light pt-8 pb-10">
        <div class="mx-auto w-full max-w-sm">
          <MadeBy />
        </div>
        <div class="mx-auto grid max-w-sm grid-cols-1 justify-center gap-4 text-center lowercase sm:grid-cols-3">
          <For each={LINKS}>
            {col => (
              <div class="mx-auto flex w-32 flex-col space-y-4">
                <For each={col}>
                  {({ title, href, ext }) =>
                    ext ? (
                      <a class={linkClass} href={href} target="_blank" rel="noopener noreferrer">
                        {title}
                      </a>
                    ) : (
                      <A href={href} class={linkClass}>
                        {title}
                      </A>
                    )
                  }
                </For>
              </div>
            )}
          </For>
        </div>
      </footer>
    </Container>
  )
}

export default Footer
