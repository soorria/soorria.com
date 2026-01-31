import { usePlausible } from 'next-plausible'
import { useCallback, useRef } from 'react'

export type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
  'Play with skills': never
  'Clicked code block copy button': {
    id: string
  }
}

type PlausibleTrackEvent = ReturnType<typeof usePlausible<AnalyticsCustomEvents>>

export const useTrackEvent: () => PlausibleTrackEvent =
  process.env.NODE_ENV === 'development'
    ? () => {
        const track = usePlausible<AnalyticsCustomEvents>()
        return useCallback(
          (...args) => {
            console.log('tracked', ...args)
            track(...args)
          },
          [track]
        ) as PlausibleTrackEvent
      }
    : () => usePlausible<AnalyticsCustomEvents>()

export const useTrackFirstEvent = (): ReturnType<typeof useTrackEvent> => {
  const isFirst = useRef(true)
  const track = useTrackEvent()

  return useCallback(
    (...args) => {
      if (isFirst.current) {
        isFirst.current = false
        track(...args)
      }
    },
    [track]
  ) as typeof track
}
