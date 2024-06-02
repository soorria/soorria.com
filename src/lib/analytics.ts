import { usePlausible } from 'next-plausible'
import { useCallback, useRef } from 'react'

export type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
  'Play with skills': {}
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTrackEvent = () => usePlausible<AnalyticsCustomEvents>()

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
