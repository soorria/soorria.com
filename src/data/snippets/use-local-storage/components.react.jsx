import { useCallback, useEffect, useState } from 'react'

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

  const clearState = useCallback(() => {
    setState(initilpjValue)
  }, [initialValue])

  return [state, setState, clearState]
}

export const LOCALSTORAGE_KEY = 'example:input'

export const Example = () => {
  const [input, setInput, reset] = useLocalStorage(LOCALSTORAGE_KEY, '')

  return (
    <div
      style={{
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        gap: '1rem',
      }}
    >
      {' '}
      <input
        style={{
          background: 'var(--base)',
          flex: '1 1',
          border: '2px solid var(--pink)',
          'border-radius': '0.25rem',
          padding: '0.5rem 1rem',
        }}
        value={input ?? ''}
        onChange={e => setInput(e.target.value)}
      />{' '}
      <button
        style={{
          padding: '0.5rem 1rem',
          background: 'var(--base-light)',
          'border-radius': '0.25rem',
        }}
        type="button"
        onClick={() => reset()}
      >
        reset
      </button>
    </div>
  )
}