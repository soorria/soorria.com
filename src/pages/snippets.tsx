import type { GetStaticProps } from 'next'
import type { SnippetFrontMatter } from '~/types/snippet'
import { NextSeo } from 'next-seo'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import PostLayout from '~/components/posts/PostLayout'
import { getAllFilesFrontMatter } from '~/lib/data'
import { DataType } from '~/types/data'
import SnippetCard from '~/components/posts/SnippetCard'
import { getOgImageForData } from '~/utils/og'
import { sortByCreatedAtField } from '~/utils/content'
import { PUBLIC_URL } from '~/constants'
import License from '~/components/License'
import { useMemo, useState } from 'react'
import { inspect } from '~/utils/misc'
import cx from '~/utils/cx'
import { AutoAnimationPlugin, getTransitionSizes } from '@formkit/auto-animate'
import Collapse from '~/components/Collapse'

interface SnippetsPageProps {
  snippets: SnippetFrontMatter[]
  tags: Array<{ label: string; value: string }>
}

const autoAnimatePlugin: AutoAnimationPlugin = (el, action, oldCoords, newCoords) => {
  let keyframes: Keyframe[] = []
  // supply a different set of keyframes for each action
  if (action === 'add') {
    keyframes = [
      { transform: 'scale(.98)', opacity: 0 },
      { transform: 'scale(0.98)', opacity: 0, offset: 0.5 },
      { transform: 'scale(1)', opacity: 1 },
    ]
  }
  // keyframes can have as many "steps" as you prefer
  // and you can use the 'offset' key to tune the timing
  if (action === 'remove') {
    keyframes = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(.98)', opacity: 0 },
    ]
  }
  if (action === 'remain') {
    // for items that remain, calculate the delta
    // from their old position to their new position
    const deltaX = oldCoords!.left - newCoords!.left
    const deltaY = oldCoords!.top - newCoords!.top
    // use the getTransitionSizes() helper function to
    // get the old and new widths of the elements
    const [widthFrom, widthTo] = getTransitionSizes(el, oldCoords!, newCoords!)
    // set up our steps with our positioning keyframes
    const start: Keyframe = {
      transform: `translate(${deltaX}px, ${deltaY}px)`,
    }
    const end: Keyframe = {
      transform: `translate(0, 0)`,
    }
    // if the dimensions changed, animate them too.
    if (widthFrom !== widthTo) {
      start.width = `${widthFrom!}px`
      end.width = `${widthTo}px`
    }
    keyframes = [start, end]
  }
  // return our KeyframeEffect() and pass
  // it the chosen keyframes.
  return new KeyframeEffect(el, keyframes, { duration: 250, easing: 'ease-in-out' })
}

const description =
  'Little bits of code that I find useful and you might too! Mostly written in TypeScript (with a transpiled JavaScript version available) and often for React and SolidJS.'
const title = 'Snippets'
const url = `${PUBLIC_URL}/snippets`

const SnippetsPage: React.FC<SnippetsPageProps> = ({ snippets: _snippets, tags }) => {
  const [grid] = useAutoAnimate<HTMLDivElement>(autoAnimatePlugin)

  const [selected, setSelected] = useState({ set: new Set<string>() })

  const snippets = useMemo(() => {
    if (!selected.set.size) return _snippets

    return _snippets.filter(s =>
      inspect(
        selected.set.has(s.category.toLowerCase()) ||
          s.tags.some(t => selected.set.has(t.toLowerCase())),
        s
      )
    )
  }, [_snippets, selected])

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
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {tags.map(tag => (
            <button
              key={tag.value}
              className={cx(
                'focus-ring rounded-full border-2 border-drac-purple px-2.5 py-1 transition hover:border-drac-pink',
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

          {selected.set.size > 0 && (
            <button
              className="focus-ring rounded-full border-2 border-drac-red px-2.5 py-1 text-drac-red transition hover:border-drac-pink"
              onClick={() => setSelected({ set: new Set() })}
            >
              Clear tags
            </button>
          )}
        </div>
      </Collapse>

      <div
        ref={grid}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
        className="grid auto-cols-min grid-cols-1 gap-y-8 gap-x-6 sm:!grid-cols-2 sm:gap-x-8 lg:gap-12"
      >
        {snippets.map(snippet => (
          <div key={snippet.slug} className="grid">
            <SnippetCard key={snippet.slug} snippet={snippet} />
          </div>
        ))}
      </div>
      {snippets.length > 0 && (
        <div className="text-center">
          {selected.set.size
            ? `${snippets.length} snippets matching your filters`
            : `${snippets.length} snippets total`}
        </div>
      )}
      <License summary="License for these snippets" />
    </PostLayout>
  )
}

export default SnippetsPage

export const getStaticProps: GetStaticProps<SnippetsPageProps> = async () => {
  const snippets = sortByCreatedAtField(
    await getAllFilesFrontMatter<SnippetFrontMatter>(DataType.snippets)
  )

  // const filterableTags = arrayUnique(
  //   snippets.flatMap(snippet => getAllTags(snippet)).map(tag => tag.toLowerCase())
  // )

  const filterableTags: Array<{ label: string; value: string }> = [
    { value: 'react', label: 'React' },
    { value: 'solidjs', label: 'SolidJS' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'miscellaneous', label: 'Miscellaneous' },
    { value: 'tailwindcss', label: 'Tailwind CSS' },
    { value: 'testing', label: 'Testing' },
  ]

  return {
    props: { snippets, tags: filterableTags },
  }
}
