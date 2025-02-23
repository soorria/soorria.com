'use client'

import { useEffect, type CSSProperties } from 'react'
import { useCssVar } from '~/utils/use-css-var'

const styles = {
  button: {
    padding: '0.5rem 1rem',
    background: 'var(--purple)',
    color: 'var(--base)',
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  input: {
    padding: '0.5rem 1rem',
    background: 'var(--base)',
    color: 'var(--content)',
    border: '2px solid var(--purple)',
    borderRadius: '4px',
  },
} satisfies Record<string, CSSProperties>

const IMAGE_SIZE = '80px'

export const EXAMPLE_CSS_VAR = '--example-css-var'
export const EXAMPLE_TRANSFORM = `rotate(calc(var(${EXAMPLE_CSS_VAR}, 45) * 1deg))`

export const Example = () => {
  const controls = useCssVar({
    name: EXAMPLE_CSS_VAR,
    root: document.querySelector('main')!,
  })

  useEffect(() => {
    controls.set('0')
  }, [controls])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          className="focus-ring"
          style={styles.input}
          type="number"
          placeholder="image rotation degrees"
          defaultValue=""
          onChange={event => {
            const value = event.target.valueAsNumber
            if (!Number.isFinite(value)) return
            controls.set(value.toFixed(2))
          }}
        />
        <button
          className="focus-ring"
          style={styles.button}
          onClick={() => controls.remove()}
        >
          Remove CSS Var
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            margin: '0',
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            transform: EXAMPLE_TRANSFORM,
            transition: 'transform 250ms ease-in-out',
          }}
          alt="logo"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          loading="lazy"
          decoding="async"
          src="/logo.png"
        />
      </div>
    </div>
  )
}
