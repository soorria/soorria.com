import { useEffect, useState } from 'react'

let _hydrated = false

export const useHydrated = (): boolean => {
  const [hydrated, setHydrated] = useState(_hydrated)

  useEffect(() => {
    _hydrated = true
    setHydrated(true)
  }, [])

  return hydrated
}
