'use client'

import { useEffect } from 'react'
import { useTrackEvent, type AnalyticsCustomEvents } from '~/lib/analytics'

export const Track = <EventName extends keyof AnalyticsCustomEvents>(props: {
  event: EventName
  params: AnalyticsCustomEvents[EventName]
}) => {
  const track = useTrackEvent()

  useEffect(() => {
    // @ts-expect-error annoying type error
    track(props.event, { props: props.params })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, props.event])

  return null
}
