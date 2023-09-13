'use client'

import { useRef, useEffect, useState, type ElementRef } from 'react'

// This block of code stops of the transition from happening if the user
// doesn't want it
const motionSafeMediaQuery = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
)
let motionSafe = motionSafeMediaQuery.matches
motionSafeMediaQuery.onchange = () => {
  motionSafe = motionSafeMediaQuery.matches
}

export type ViewTransitionCallback = () => void | Promise<void>

type ObjectWithStartViewTransition = {
  startViewTransition: (callback: ViewTransitionCallback) => void
}

export function safeViewTransition(callback: ViewTransitionCallback) {
  if (
    motionSafe &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document
  ) {
    // Needed until TypeScript catches up
    const doc = document as unknown as ObjectWithStartViewTransition
    doc.startViewTransition(callback)
  } else {
    callback()
  }
}

export const VanillaExample = () => {
  const [slow, setSlow] = useState(false)
  const [differentTransitionName, setDifferentTransitionName] = useState(false)
  const [clicked, setClicked] = useState(false)

  const boxRef = useRef<ElementRef<'button'>>(null)
  const toggledRef = useRef(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const handler = () => {
      toggledRef.current = !toggledRef.current
      safeViewTransition(() => {
        box.classList.toggle('toggled', toggledRef.current)
      })
      setClicked(true)
    }

    box.addEventListener('click', handler)

    return () => {
      box.removeEventListener('click', handler)
    }
  }, [])

  return (
    <>
      Click the box to see it move and grow! If you toggle the animation speed,
      you can see how &quot;Hi!&quot; text is handled with, and without a
      separate <code>view-transition-name</code>.
      <div className="svt-container">
        <button className="svt-box" ref={boxRef}>
          <span className={differentTransitionName ? 'svt-box-content' : ''}>
            HI!
          </span>
        </button>

        <span
          style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: '40rem',
            textAlign: 'center',
            pointerEvents: 'none',
            transition: 'opacity 0.1s ease',
            opacity: clicked ? 0 : 1,
          }}
        >
          ← Click the square-ish button!
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <button className="svt-button" onClick={() => setSlow(!slow)}>
          Toggle animation speed to {slow ? 'fast' : 'slow'}
        </button>
        <button
          className="svt-button"
          onClick={() => setDifferentTransitionName(!differentTransitionName)}
        >
          Toggle to {differentTransitionName ? 'no' : 'different'} content
          transition name
        </button>
      </div>
      <style>{`
        ::view-transition-group(box),
        ::view-transition-group(box-content) {
          animation-duration: ${slow ? '10s' : '0.25s'};
        }
      `}</style>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .svt-container {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          position: relative;
        }
        .svt-container:has(.toggled) {
          justify-content: flex-end;
        }

        .svt-box {
          display: grid;
          place-items: center;
          width: 80px;
          aspect-ratio: 1;
          background: var(--red);
          border: none;
          color: var(--base);
          font-family: sans-serif;
          font-size: 2rem;
          font-weight: bold;
          view-transition-name: box;
          cursor: pointer;
          border-radius: 0.25rem;
        }
        .svt-box.toggled {
          width: 120px;
          rotate: 0.5turn;
          background: var(--cyan);
          margin-left: 100px;
        }
        .svt-button {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          background: var(--base-dark);
          font-size: 0.875rem;
        }

        .svt-box-content {
          view-transition-name: box-content;
        }
      `}</style>
    </>
  )
}
