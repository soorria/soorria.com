import { useCallback, useEffect, useRef, useState } from 'react'

type FullscreenControls = {
  enter: (element: Element, options?: FullscreenOptions) => Promise<void>
  exit: () => Promise<void>
  toggle: (element: Element, options?: FullscreenOptions) => Promise<void>
}

export const useFullscreen = (): [
  fullscreenElement: Element | null,
  controls: FullscreenControls
] => {
  const [fullscreenElement, setFullscreenElement] = useState<Element | null>(null)

  const fullscreenElementRef = useRef<Element | null>(null)

  useEffect(() => {
    const handler = () => {
      setFullscreenElement(document.fullscreenElement)
      fullscreenElementRef.current = document.fullscreenElement
    }
    document.addEventListener('fullscreenchange', handler)

    return () => {
      document.removeEventListener('fullscreenchange', handler)
    }
  }, [])

  const enter = useCallback<FullscreenControls['enter']>(async (element, options) => {
    await element.requestFullscreen(options)
  }, [])

  const exit = useCallback<FullscreenControls['exit']>(async () => {
    await document.exitFullscreen()
  }, [])

  const toggle = useCallback<FullscreenControls['toggle']>(
    async (element, options) => {
      if (fullscreenElementRef.current === element) {
        await exit()
      } else {
        await enter(element, options)
      }
    },
    [enter, exit]
  )

  return [
    fullscreenElement,
    {
      enter,
      exit,
      toggle,
    },
  ]
}
