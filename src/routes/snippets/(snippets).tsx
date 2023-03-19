import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { createMemo, createSignal, For, VoidComponent } from 'solid-js'
import { useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'

import Collapse from '~/components/Collapse'
import PostLayout from '~/components/layout/PostLayout'
import SnippetCard from '~/components/posts/SnippetCard'
import { PUBLIC_URL } from '~/constants'
import { snippetFrontMatters } from '~/lib/data'
import { Seo } from '~/lib/seo'
import { getAllTags, sortByCreatedAtField } from '~/utils/content'
import cx from '~/utils/cx'
import { intersectionSet } from '~/utils/misc'
import { getOgImageForData } from '~/utils/og'

const filterableTags: Array<{ label: string; value: string }> = [
  { value: 'react', label: 'React' },
  { value: 'solidjs', label: 'SolidJS' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
  { value: 'tailwindcss', label: 'Tailwind CSS' },
  { value: 'testing', label: 'Testing' },
]

const description =
  'Little bits of code that I find useful and you might too! Mostly written in TypeScript (with a transpiled JavaScript version available) and often for React and SolidJS.'
const title = 'Snippets'
const url = `${PUBLIC_URL}/snippets`

const tagBaseClass = 'focus-ring rounded-full border-2 transition hocus:border-drac-pink'

const SnippetsPage: VoidComponent = () => {
  const data = useRouteData<typeof routeData>()
  const [grid] = createAutoAnimate<HTMLDivElement>()

  const [matchAll, setMatchAll] = createSignal(false)
  const [selected, setSelected] = createSignal(new Set<string>(), { equals: false })

  const snippets = createMemo(() => {
    const snippets = data.snippets() || []
    const selectedSet = selected()
    if (!selectedSet.size) return snippets

    if (matchAll()) {
      return snippets.filter(
        s => intersectionSet(selectedSet, new Set(getAllTags(s))).size === selectedSet.size
      )
    }

    return snippets.filter(
      s =>
        selectedSet.has(s.category.toLowerCase()) ||
        s.tags.some(t => selectedSet.has(t.toLowerCase()))
    )
  })

  return (
    <PostLayout title="Snippets">
      <Seo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImageForData('snippets')],
        }}
      />
      <p class="mt-6 text-center text-lg">{description}</p>

      <Collapse summary="Filters">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="text-lg font-bold">Tags</div>
            <div class="flex items-center gap-2 text-[11px]">
              <button
                class={cx(
                  tagBaseClass,
                  'border-drac-purple px-1.5 py-0.5',
                  selected().size > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                onClick={() => setMatchAll(!matchAll())}
              >
                Match {matchAll() ? 'all tags' : 'any tag'}
              </button>
              <button
                class={cx(
                  tagBaseClass,
                  'border-drac-red px-1.5 py-0.5 text-drac-red',
                  selected().size > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                onClick={() => {
                  setSelected(new Set<string>())
                  setMatchAll(false)
                }}
              >
                Clear tags
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 text-xs font-bold">
            <For each={filterableTags}>
              {tag => (
                <button
                  class={cx(
                    tagBaseClass,
                    'border-drac-purple px-2.5 py-1',
                    selected().has(tag.value) && 'bg-drac-purple text-drac-base'
                  )}
                  onClick={() => {
                    const set = selected()
                    if (set.has(tag.value)) {
                      set.delete(tag.value)
                    } else {
                      set.add(tag.value)
                    }
                    setSelected(set)
                  }}
                >
                  {tag.label}
                </button>
              )}
            </For>
          </div>
          <p class="text-sm text-drac-highlight">
            See snippets matching <em>{matchAll() ? 'all' : 'any'}</em> of the the selected tags.
          </p>
        </div>
      </Collapse>

      <div
        ref={grid}
        style={{ 'grid-template-columns': 'repeat(auto-fit, minmax(240px, 1fr))' }}
        class="grid auto-cols-min grid-cols-1 content-start gap-y-8 gap-x-6 sm:!grid-cols-2 sm:gap-x-8 lg:gap-12"
      >
        <For each={snippets()}>
          {snippet => (
            <div class="grid">
              <SnippetCard snippet={snippet} />
            </div>
          )}
        </For>
      </div>

      <div class="text-center">
        {selected().size
          ? `${snippets().length} snippets matching your filters`
          : `${snippets().length} snippets total`}
      </div>
      {/* <License summary="License for these snippets" /> */}
    </PostLayout>
  )
}

export default SnippetsPage

export const routeData = () => {
  const snippets = createServerData$(async () => sortByCreatedAtField(snippetFrontMatters.list))

  return {
    snippets,
  }
}
