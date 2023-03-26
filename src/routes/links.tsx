import { For, onMount } from 'solid-js'

import Hero from '~/components/landing/Hero'
import Container from '~/components/layout/Container'
import MadeBy from '~/components/layout/MadeBy'
import Sparkles from '~/components/mdx/Sparkles'
import { useTrackEvent } from '~/lib/potato'
import { links } from '~/links'
import cx from '~/utils/cx'

const classes = {
  anchor: cx(
    'group flex items-center justify-between rounded-lg bg-drac-base/70 py-6 px-8 text-drac-pink transition',
    'hocus:bg-drac-base hocus:text-drac-purple hocus:shadow-xl',
    'focus:outline-none focus:ring focus:ring-drac-purple'
  ),
}

const orderedLinks = [
  links.twitter,
  links.github,
  links.discord,
  links.email,
  links.mal,
  links.facebook,
  links.linkedin,
]

const LinksPage = () => {
  const track = useTrackEvent()

  onMount(() => {
    track('Links Page', { props: {} })
  })

  return (
    <>
      <Container>
        <div class="h-8 sm:h-20" />
        <div class="relative">
          <Hero title="Hey, I'm Soorria!">
            <main class="relative mx-auto mt-8 max-w-md space-y-8 text-lg sm:mt-24 sm:text-xl">
              <For each={orderedLinks}>
                {({ title, href, icon: Icon, iconAlt }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" class={classes.anchor}>
                    <Icon
                      aria-label={iconAlt}
                      class="mr-3 h-7 w-7 transition-transform group-hocus:-rotate-20"
                    />
                    <span>{title}</span>
                  </a>
                )}
              </For>
              <div class="text-4xl">
                <Sparkles block>
                  <a
                    href={links.site.href + '?ref=links'}
                    class={cx(classes.anchor, 'text-lg shadow-2xl')}
                  >
                    <links.site.icon
                      aria-label={links.site.iconAlt}
                      class="mr-3 h-7 w-7 transition-transform duration-300 group-hocus:-rotate-[360deg]"
                    />
                    <span>the rest of my website</span>
                  </a>
                </Sparkles>
              </div>
              <div class="h-16" />
            </main>
          </Hero>
        </div>
        <footer class="pt-8 pb-10 text-lg">
          <MadeBy />
        </footer>
      </Container>
    </>
  )
}

export default LinksPage
