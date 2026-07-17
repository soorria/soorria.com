import { useCallback, useRef } from 'react'

export type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
  'Play with skills': never
  'Clicked code block copy button': {
    id: string
  }
}

type PlausibleTrackEvent = <EventName extends keyof AnalyticsCustomEvents>(
  event: EventName,
  options?: { props?: AnalyticsCustomEvents[EventName] }
) => void

export const useTrackEvent = (): PlausibleTrackEvent =>
  useCallback((event, options) => {
    if (process.env.NODE_ENV !== 'production') console.log('tracked', event, options)
    const plausible = (window as typeof window & { plausible?: (...args: unknown[]) => void })
      .plausible
    plausible?.(event, options)
  }, []) as PlausibleTrackEvent

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
