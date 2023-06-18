'use client'

import { useMemo, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import type { SnippetFrontMatter } from '~/types/snippet'
import PostLayout from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter } from '~/lib/data'
import { DataType } from '~/types/data'
import SnippetCard from '~/components/posts/SnippetCard'
import { getOgImageForData } from '~/utils/og'
import { getAllTags, sortByCreatedAtField } from '~/utils/content'
import { PUBLIC_URL } from '~/constants'
import License from '~/components/License'
import cx from '~/utils/cx'
import Collapse from '~/components/Collapse'
import { intersectionSet } from '~/utils/misc'

const description =
  'Little bits of code that I find useful and you might too! Mostly written in TypeScript (with a transpiled JavaScript version available) and often for React and SolidJS.'
const title = 'Snippets'
const url = `${PUBLIC_URL}/snippets`

const tagBaseClass = 'focus-ring rounded-full border-2 transition hocus:border-drac-pink'

const SnippetsPage = async () => {
  const _snippets = sortByCreatedAtField(
    await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)
  )

  // const filterableTags = arrayUnique(
  //   snippets.flatMap(snippet => getAllTags(snippet)).map(tag => tag.toLowerCase())
  // )

  const tags: Array<{ label: string; value: string }> = [
    { value: 'react', label: 'React' },
    { value: 'solidjs', label: 'SolidJS' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'miscellaneous', label: 'Miscellaneous' },
    { value: 'tailwindcss', label: 'Tailwind CSS' },
    { value: 'testing', label: 'Testing' },
  ]

  const grid = useAutoAnimate({})

  const [matchAll, setMatchAll] = useState(false)
  const [selected, setSelected] = useState({ set: new Set<string>() })

  const snippets = useMemo(() => {
    if (!selected.set.size) return _snippets

    if (matchAll) {
      return _snippets.filter(
        s => intersectionSet(selected.set, new Set(getAllTags(s))).size === selected.set.size
      )
    }

    return _snippets.filter(
      s =>
        selected.set.has(s.category.toLowerCase()) ||
        s.tags.some(t => selected.set.has(t.toLowerCase()))
    )
  }, [_snippets, selected, matchAll])

  return (
    <PostLayout title="Snippets">
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          type: 'website',
          url,
          images: [getOgImageForData(DataType.snippets)],
        }}
      />
      <p className="mt-6 text-center text-lg">{description}</p>

      <Collapse summary="Filters">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">Tags</div>
            <div className="flex items-center gap-2 text-[11px]">
              <button
                className={cx(
                  tagBaseClass,
                  'border-drac-purple px-1.5 py-0.5',
                  selected.set.size > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                onClick={() => setMatchAll(!matchAll)}
              >
                Match {matchAll ? 'all tags' : 'any tag'}
              </button>
              <button
                className={cx(
                  tagBaseClass,
                  'border-drac-red px-1.5 py-0.5 text-drac-red',
                  selected.set.size > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                onClick={() => {
                  setSelected({ set: new Set() })
                  setMatchAll(false)
                }}
              >
                Clear tags
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {tags.map(tag => (
              <button
                key={tag.value}
                className={cx(
                  tagBaseClass,
                  'border-drac-purple px-2.5 py-1',
                  selected.set.has(tag.value) && 'bg-drac-purple text-drac-base'
                )}
                onClick={() => {
                  if (selected.set.has(tag.value)) {
                    selected.set.delete(tag.value)
                  } else {
                    selected.set.add(tag.value)
                  }
                  setSelected({ set: selected.set })
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-drac-highlight">
            See snippets matching <em>{matchAll ? 'all' : 'any'}</em> of the the selected tags.
          </p>
        </div>
      </Collapse>

      <div
        ref={grid}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
        className="grid auto-cols-min grid-cols-1 content-start gap-x-6 gap-y-8 sm:!grid-cols-2 sm:gap-x-8 lg:gap-12"
      >
        {snippets.map(snippet => (
          <div key={snippet.slug} className="grid">
            <SnippetCard key={snippet.slug} snippet={snippet} />
          </div>
        ))}
      </div>

      <div className="text-center">
        {selected.set.size
          ? `${snippets.length} snippets matching your filters`
          : `${snippets.length} snippets total`}
      </div>
      <License summary="License for these snippets" />
    </PostLayout>
  )
}

export default SnippetsPage
