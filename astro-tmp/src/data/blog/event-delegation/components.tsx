'use client'

import { useState, type MouseEvent } from 'react'
import { css } from '~/components/mdx/styles'

const layer = css({
  display: 'grid',
  placeItems: 'center',
  padding: '1rem',
  position: 'relative',
  borderRadius: '0.25rem',
  overflow: 'hidden',
  '&.clicked:before': {
    content: "'clicked!'",
    position: 'absolute',
    background: 'var(--base)',
    padding: '0 0.25rem',
    top: 0,
    left: 0,
    width: 'max-content',
    color: 'var(--content)',
    fontSize: '11px',
    zIndex: 10,
  },
  '&:after': {
    content: "'<' attr(data-el) '>'",
    position: 'absolute',
    color: 'var(--base)',
    bottom: 0,
    right: 0,
    fontSize: '10px',
    padding: '0 0.125rem',
    zIndex: 10,
  },
})

export const BubblingDemo = () => {
  const [clicked, setClicked] = useState(false)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (clicked) return
    setClicked(true)
    // Element that the event listener was added to
    const currentTargetElementLayer = parseInt(
      event.currentTarget.dataset.layer!
    )
    // Element that was actually clicked
    const targetElementLayer = parseInt(
      (event.target as HTMLElement).dataset.layer!
    )
    const delay = currentTargetElementLayer - targetElementLayer

    const el = event.currentTarget

    const timeoutMult = 200

    setTimeout(() => {
      el.classList.add('clicked')
      setTimeout(() => {
        el.classList.remove('clicked')

        if (currentTargetElementLayer === 3) {
          setClicked(false)
        }
      }, timeoutMult)
    }, delay * timeoutMult)
  }
  return (
    // eslint-disable-next-line
    <section
      data-layer={3}
      data-el="section"
      style={{
        background: 'mediumaquamarine',
        cursor: clicked ? 'not-allowed' : undefined,
      }}
      className={layer}
      onClick={handleClick}
    >
      {/* eslint-disable-next-line */}
      <div
        data-layer={2}
        data-el="div"
        style={{ background: 'lightcoral', minWidth: '75%' }}
        className={layer}
        onClick={handleClick}
      >
        {/* eslint-disable-next-line */}
        <p
          data-layer={1}
          data-el="p"
          style={{
            background: 'lightblue',
            margin: 0,
            minWidth: '50%',
          }}
          className={layer}
          onClick={handleClick}
        >
          <button
            data-layer={0}
            data-el="button"
            style={{
              background: 'lightgreen',
              color: 'var(--base)',
              display: 'grid',
            }}
            className={layer}
            onClick={handleClick}
          >
            Click me!
            <span
              style={{
                display: clicked ? 'grid' : 'none',
                background: 'inherit',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                placeItems: 'center',
                cursor: 'not-allowed',
                zIndex: 1,
              }}
            >
              Clicked!
            </span>
          </button>
        </p>
      </div>
    </section>
  )
}
