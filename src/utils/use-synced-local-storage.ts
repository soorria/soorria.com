import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'

import mitt from 'mitt'

const em = mitt<Record<string, any>>()

export const useSyncedLocalStorage = <T, K extends string>(
  key: K,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue)
  const initialised = useRef(false)
  const initialValueRef = useRef(initialValue)

  useEffect(() => {
    initialValueRef.current = initialValue
  }, [initialValue])

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true

    const cached = localStorage.getItem(key)

    if (!cached) return initialValueRef.current

    try {
      return JSON.parse(cached)
    } catch (err) {
      return initialValueRef.current
    }
  }, [key])

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === key) {
        setState(event.newValue === null ? initialValueRef.current : JSON.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handler)

    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [key])

  useEffect(() => {
    const handler = (data: T) => {
      setState(data)
    }

    em.on(key, handler)

    return () => {
      em.off(key, handler)
    }
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
    em.emit(key, state)
  }, [state, key])

  return [state, setState]
}
