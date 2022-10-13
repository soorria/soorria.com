import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import mitt from 'mitt'

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

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue | undefined }
  | JsonValue[]

type NonNullJsonValue = Exclude<JsonValue, null>

export const useSyncedLocalStorage = <T extends NonNullJsonValue, K extends string>(
  key: K,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue)
  const initialised = useRef(false)
  const shouldSync = useRef(false)
  const emitting = useRef(false)
  const initialValueRef = useRef(initialValue)

  useEffect(() => {
    initialValueRef.current = initialValue
  }, [initialValue])

  useEffect(() => {
    trackedKeys[key] = (trackedKeys[key] ?? 0) + 1
    return () => {
      trackedKeys[key]--
    }
  }, [key])

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true

    const cached = localStorage.getItem(key)

    if (!cached) {
      setState(initialValueRef.current)
      return
    }

    try {
      setState(JSON.parse(cached) as T)
    } catch (err) {
      setState(initialValueRef.current)
    }
  }, [key])

  useEffect(() => {
    const handler = (data: T | null) => {
      // If this hook is the one that sent the message, just ignore it
      if (!emitting.current) {
        shouldSync.current = false
        setState(data ?? initialValueRef.current)
      }
    }

    em.on(key, handler)

    return () => {
      em.off(key, handler)
    }
  }, [key])

  useEffect(() => {
    // Prevents this hook from re-sending an update
    if (!shouldSync.current) {
      shouldSync.current = true
      return
    }

    // Prevents this hook from setting itself again
    emitting.current = true
    em.emit(key, state)
    emitting.current = false
  }, [state, key])

  return [state, setState]
}
