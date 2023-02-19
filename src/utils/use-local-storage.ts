import { Accessor, createEffect, createSignal, Setter } from 'solid-js'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [Accessor<T>, Setter<T>, () => void] => {
  const [state, setState] = createSignal<T>(
    (() => {
      const cached = localStorage.getItem(key)

      if (!cached) return initialValue

      try {
        return JSON.parse(cached) as T
      } catch (err) {
        return initialValue
      }
    })()
  )

  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(state()))
  })

  const clearState = () => {
    setState(() => initialValue)
  }

  return [state, setState, clearState]
}
