'use client'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { SKILLS_MAGIC_NUMBERS } from '~/lib/skills/definitions'
import cx from '~/utils/cx'
import ShowWhenVisible from '../ShowWhenVisible'
import dynamic from 'next/dynamic'

const LazyLiveSkillsArea = dynamic(
  () => import('./LiveSkillsArea').then(mod => mod.LiveSkillsArea),
  {
    ssr: false,
  }
)

function useElementWidth(element: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!element.current) return

    const handleResize = () => {
      setWidth(element.current?.clientWidth ?? 0)
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(element.current)

    handleResize()

    return () => observer.disconnect()
  }, [element])

  return width
}

function useDebouncedValue<T>(target: T, delayMs = 250): T {
  const [state, setState] = useState(target)

  useEffect(() => {
    const timeout = setTimeout(() => setState(target), delayMs)
    return () => clearTimeout(timeout)
  }, [target, delayMs])

  return state
}

export function SkillsArea(props: { staticFallback?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const width = useDebouncedValue(useElementWidth(rootRef))

  const scale = width / SKILLS_MAGIC_NUMBERS.rootWidthPx
  const unscaledImageWidth = SKILLS_MAGIC_NUMBERS.imageWidthPx
  const imageWidth = unscaledImageWidth * scale

  const ready = width !== 0

  return (
    <>
      <p className="relative z-10 mb-4 bg-drac-base/50 text-lg">
        Here are some of the technical skills I&apos;ve learned during my degree, work, and just out
        of curiosity.{' '}
        <span className={ready ? 'opacity-100' : 'opacity-0'}>
          You can play around with the logos below - drag them around and they&apos;ll move for
          anyone else looking at this section!
        </span>
      </p>

      <div ref={rootRef} className="relative mb-8 aspect-video overflow-y-visible">
        <ShowWhenVisible>
          {ready && <LazyLiveSkillsArea scale={scale} imageWidth={imageWidth} rootRef={rootRef} />}
        </ShowWhenVisible>

        <div
          className={cx(
            'pointer-events-none opacity-0 transition-opacity',
            !ready && 'pointer-events-auto opacity-100'
          )}
        >
          {props.staticFallback}
        </div>
      </div>
    </>
  )
}
