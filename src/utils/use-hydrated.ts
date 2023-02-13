import { Accessor, createSignal, onMount } from 'solid-js'

let _hydrated = false

export const useHydrated = (): Accessor<boolean> => {
  const [hydrated, setHydrated] = createSignal(_hydrated)

  onMount(() => {
    _hydrated = true
    setHydrated(true)
  })

  return hydrated
}
