import { createEffect, createSignal, For, on, VoidComponent } from 'solid-js'
import { A, useIsRouting, useLocation } from 'solid-start'

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
  let nav: HTMLElement | undefined
  let bg: HTMLDivElement | undefined
  const location = useLocation()
  const [showBg, setShowBg] = createSignal(false)
  const isRouting = useIsRouting()

  const positionBg = () => {
    if (!nav) return

    const currentA =
      nav.querySelector<HTMLAnchorElement>('a[data-hover]') ??
      nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
    nav.querySelectorAll('a').forEach(a => a.removeAttribute('data-highlight'))
    if (!currentA || !bg || !nav) {
      setShowBg(false)
      return
    }

    currentA.dataset.highlight = 'true'

    const navRect = nav.getBoundingClientRect()
    const aRect = currentA.getBoundingClientRect()

    bg.style.width = `${aRect.width}px`
    bg.style.height = `${aRect.height}px`
    bg.style.transform = `translate3d(${aRect.x - navRect.x}px, 0px, 0px)`
    if (!showBg()) {
      bg.style.transition = 'none'
      getComputedStyle(bg).transform
      bg.style.removeProperty('transition')
    }
    setShowBg(true)
  }

  createEffect(
    on([isRouting, () => location.pathname], () => {
      positionBg()
    })
  )

  return (
    <Container>
      <a
        href="#main-content"
        class="focus-ring fixed left-1/2 -top-10 z-50 mx-auto block translate-x-1/2 rounded bg-drac-base px-4 py-2 font-display font-bold text-drac-pink transition-transform focus:translate-y-16 focus:ring-2 hocus:shadow-xl"
      >
        Skip to Main Content
      </a>
      <header class="flex items-center justify-between py-8">
        <SpinnyHomeLink />
        <nav ref={nav} class="group relative flex space-x-1 font-display sm:space-x-3 sm:text-lg">
          <For each={LINKS}>
            {({ title, href }) => (
              <A
                href={href}
                class="focus-ring relative rounded border-drac-content px-2 py-1 leading-none transition focus-visible:text-drac-pink data-[highlight]:text-drac-pink sm:py-2 sm:px-3"
              >
                {title}
              </A>
            )}
          </For>

          <div
            ref={bg}
            class="absolute -z-10 !m-0 rounded bg-drac-base-light transition"
            role="presentation"
            classList={{
              'opacity-0': !showBg(),
              'opacity-100': showBg(),
            }}
          />
        </nav>
      </header>
    </Container>
  )
}

export default Header
