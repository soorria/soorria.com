export type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTrackEvent = () => {
  // TODO: add plausible
  // usePlausible<AnalyticsCustomEvents>()
  return <Event extends keyof AnalyticsCustomEvents, Props extends AnalyticsCustomEvents[Event]>(
    e: Event,
    p: { props: Props }
  ) => {}
}

export const useTrackFirstEvent = (): ReturnType<typeof useTrackEvent> => {
  let isFirst = true
  const track = useTrackEvent()

  return (...args) => {
    if (isFirst) {
      isFirst = false
      track(...args)
    }
  }
}
