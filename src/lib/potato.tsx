import { DEV } from 'solid-js'

export type AnalyticsCustomEvents = {
  'Easter Egg': { which: string }
  'Links Page': { link?: string }
}

/**
 * From https://github.com/4lejandrito/next-plausible/blob/master/index.tsx
 */
type Props = Record<string, unknown> | never
type EventOptions<P> = {
  props: P
  u?: string
  callback?: VoidFunction
}

type EventOptionsTuple<P extends Props> = P extends never
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>]

type Plausible = <
  Event extends keyof AnalyticsCustomEvents,
  Props extends AnalyticsCustomEvents[Event]
>(
  e: Event,
  ...rest: EventOptionsTuple<Props>
) => void

export const useTrackEvent = (): Plausible => {
  return <Event extends keyof AnalyticsCustomEvents, Props extends AnalyticsCustomEvents[Event]>(
    e: Event,
    ...rest: EventOptionsTuple<Props>
  ) => {
    return (window as { plausible?: Plausible }).plausible?.(e, ...rest)
  }
}

export const useTrackFirstEvent = () => {
  let isFirst = true
  const track = useTrackEvent()

  return ((...args) => {
    if (isFirst) {
      isFirst = false
      track(...args)
    }
  }) as Plausible
}

/**
 * Adapted from https://github.com/4lejandrito/next-plausible/blob/master/index.tsx
 */

export const PlausibleScript = () =>
  DEV ? null : (
    <>
      <script
        async
        defer
        src="https://soorria.com/js/potato.js"
        data-domain="mooth.tech"
        data-api="/proxy/api/event"
      />
      <script
        id="next-plausible-init"
        // eslint-disable-next-line solid/no-innerhtml
        innerHTML={`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      />
    </>
  )
