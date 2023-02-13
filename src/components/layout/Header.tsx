import { For, VoidComponent } from 'solid-js'
import { A } from 'solid-start'
import SpinnyHomeLink from '../SpinnyHomeLink'
import Container from './Container'

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

const Header: VoidComponent = () => {
  return (
    <Container>
      <a
        href="#main-content"
        class="focus-ring fixed left-1/2 z-50 mx-auto block -translate-y-full -translate-x-1/2 transform rounded bg-drac-base px-4 py-2 font-display font-bold text-drac-pink transition-transform focus:translate-y-2 focus:ring-2 hocus:shadow-xl"
      >
        Skip to Main Content
      </a>
      <header class="flex items-center justify-between py-8">
        <SpinnyHomeLink />
        <nav class="flex space-x-1 font-display sm:space-x-3 sm:text-lg">
          <For each={LINKS}>
            {({ title, href }) => (
              <A
                href={href}
                class="focus-ring relative overflow-hidden rounded border-drac-content px-2 py-1 leading-none transition hocus:bg-drac-base-light hocus:text-drac-pink sm:py-2 sm:px-3"
              >
                {title}
              </A>
            )}
          </For>
        </nav>
      </header>
    </Container>
  )
}

export default Header
