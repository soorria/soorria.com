type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
  'Play with skills': {}
  'Clicked code block copy button': {
    id: string
  }
}

type EventOptionsTuple<P extends Record<string, unknown>> = P extends never
  ? []
  : [
      {
        props: P
      },
    ]

declare function plausible<N extends keyof AnalyticsCustomEvents>(
  eventName: N,
  ...rest: EventOptionsTuple<AnalyticsCustomEvents[N]>
): unknown

const typedWindow =
  typeof window === 'undefined' ? undefined : (window as { plausible?: typeof plausible })

export const track = ((...args) => typedWindow?.plausible?.(...args)) as typeof plausible

export function createTrackFirstEvent() {
  let hasRun = false
  return ((...args) => {
    if (hasRun) return
    hasRun = true
    return track(...args)
  }) as typeof plausible
}
