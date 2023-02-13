import mitt from 'mitt'
import { Accessor, createEffect, createSignal, onCleanup, onMount, Setter } from 'solid-js'

const em = mitt<Record<string, any>>()

// Store which keys are tracked so we don't do unnecessary work for other uses of localStorage
const trackedKeys: Record<string, number> = {}

// This block relies on window, so to make sure it only runs on the client
// we need to icheck if `window` is defined
if (typeof window !== 'undefined') {
  // We define this globally since it simplifies the already extremely
  // complicated hook a tiny bit, and we can handle it all in one event handler
  window.addEventListener('storage', event => {
    if (
      // the `storage` event also fires for `sessonStorage`, and we don't care about that for this hook
      event.storageArea === localStorage &&
      // Intentionally using `!=` instead of `!==` since it checks `null` and `undefined`
      event.key != null &&
      trackedKeys[event.key]
    ) {
      let parsed
      try {
        parsed = JSON.parse(event.newValue ?? '') as unknown
      } catch {
        parsed = null
      }
      em.emit(event.key, event.newValue == null ? null : parsed)
    }
  })

  // Same as above  - we can handle setting localStorage all in one spot.
  em.on('*', (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  })
}

type JsonValue = NonNullJsonValue | null

type NonNullJsonValue = string | number | boolean | { [key: string]: JsonValue } | JsonValue[]

export const useSyncedLocalStorage = <T extends NonNullJsonValue = NonNullJsonValue>(
  key: string,
  initialValue: T
): [Accessor<T>, Setter<T>] => {
  const [state, setState] = createSignal<T>(initialValue)
  let initialised = false
  let shouldSync = false
  let emitting = false

  onMount(() => {
    trackedKeys[key] = (trackedKeys[key] ?? 0) + 1
  })
  onCleanup(() => {
    trackedKeys[key]--
  })

  createEffect(() => {
    if (initialised) return
    initialised = true

    const cached = localStorage.getItem(key)

    if (!cached) {
      setState(() => initialValue)
      return
    }

    try {
      setState(() => JSON.parse(cached) as T)
    } catch (err) {
      setState(() => initialValue)
    }
  })

  createEffect(() => {
    const handler = (data: T | null) => {
      // If this hook is the one that sent the message, just ignore it
      if (!emitting) {
        shouldSync = false
        setState(() => data ?? initialValue)
      }
    }

    em.on(key, handler)

    onCleanup(() => {
      em.off(key, handler)
    })
  })

  createEffect(() => {
    // Prevents this hook from re-sending an update
    if (!shouldSync) {
      shouldSync = true
      return
    }

    // Prevents this hook from setting itself again
    emitting = true
    em.emit(key, state)
    emitting = false
  }, [state, key])

  return [state, setState]
}
