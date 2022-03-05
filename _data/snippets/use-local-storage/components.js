import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const cached = localStorage.getItem(key)

    if (!cached) return initialValue

    try {
      return JSON.parse(cached)
    } catch (err) {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state, key])

  const clearState = () => {
    setState(initialValue)
  }

  return [state, setState, clearState]
}

export const LOCALSTORAGE_KEY = 'example:input'

const ActualDemoComponent = () => {
  const [input, setInput, reset] = useLocalStorage(LOCALSTORAGE_KEY, '')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <input
        style={{
          background: 'var(--bg)',
          border: '2px solid var(--pink)',
          padding: '0.5rem 1rem',
        }}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        style={{
          padding: '0.5rem 1rem',
          background: 'var(--curr)',
        }}
        type="button"
        onClick={() => reset()}
      >
        reset
      </button>
    </div>
  )
}

export const Example = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return <>{mounted ? <ActualDemoComponent /> : null}</>
}
