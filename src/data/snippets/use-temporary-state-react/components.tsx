'use client'

import type { SetStateAction, Dispatch } from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'

export const useTemporaryState = <State,>(
  initial: State | (() => State),
  timeout = 2000
): [State, Dispatch<SetStateAction<State>>] => {
  const [state, _setState] = useState<State>(initial)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const initialValueRef = useRef(initial)

  useEffect(() => {
    initialValueRef.current = initial
  }, [initial])

  const setState: typeof _setState = useCallback(
    async valueOrUpdater => {
      _setState(valueOrUpdater)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(
        () => _setState(initialValueRef.current),
        timeout
      )
    },
    [timeout]
  )

  return [state, setState]
}

export const Example = () => {
  const [color, setColor] = useTemporaryState<string | undefined>(undefined)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
      }}
    >
      <div>
        <label
          htmlFor="color-input"
          style={{ display: 'block', marginBottom: '0.25rem' }}
        >
          Temporarily change the box&apos;s color:
        </label>
        <input
          id="color-input"
          type="color"
          onChange={e => setColor(e.currentTarget.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div
        style={{
          height: '4rem',
          borderRadius: '0.5rem',
          backgroundColor: color ? color : 'var(--pink)',
          transition: color ? 'none' : 'background-color 0.2s ease-in-out',
        }}
      ></div>
    </div>
  )
}
