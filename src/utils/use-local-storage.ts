import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const [state, setState] = useState<T>(() => {
    const cached = localStorage.getItem(key)

    if (!cached) return initialValue

    try {
      return JSON.parse(cached) as T
    } catch (err) {
      return initialValue
    }
  })

  useEffect(() => {
    console.log({ key, state })
    localStorage.setItem(key, JSON.stringify(state))
  }, [state, key])

  const clearState = () => {
    setState(initialValue)
  }

  return [state, setState, clearState]
}
