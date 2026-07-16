'use client'

import { useCallback, useRef } from 'react'

export type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
  'Play with skills': never
  'Clicked code block copy button': {
    id: string
  }
}

type PlausibleFunction = <EventName extends keyof AnalyticsCustomEvents>(
  event: EventName,
  options?: { props: AnalyticsCustomEvents[EventName] }
) => void

const getPlausible = (): PlausibleFunction => {
  if (typeof window !== 'undefined' && 'plausible' in window) {
    return (window as unknown as { plausible: PlausibleFunction }).plausible
  }
  // Return no-op if plausible isn't loaded yet
  return () => {}
}

export const useTrackEvent = (): PlausibleFunction => {
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

  return useCallback(
    ((event, options) => {
      if (isDev) {
        console.log('tracked', event, options?.props)
      }
      const plausible = getPlausible()
      plausible(event, options)
    }) as PlausibleFunction,
    [isDev]
  )
}

export const useTrackFirstEvent = (): PlausibleFunction => {
  const isFirst = useRef(true)
  const track = useTrackEvent()

  return useCallback(
    ((event, options) => {
      if (isFirst.current) {
        isFirst.current = false
        track(event, options)
      }
    }) as PlausibleFunction,
    [track]
  )
}
