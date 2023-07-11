'use client'

import { useRef, useEffect, useState } from 'react'

// This block of code stops of the transition from happening if the user
// doesn't want it
const motionSafeMediaQuery = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
)
let motionSafe = motionSafeMediaQuery.matches
motionSafeMediaQuery.onchange = () => {
  motionSafe = motionSafeMediaQuery.matches
}

export function safeViewTransition(callback) {
  if (
    motionSafe &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document
  ) {
    // Needed until TypeScript catches up
    const doc = document
    doc.startViewTransition(callback)
  } else {
    callback()
  }
}

export const VanillaExample = () => {
  const [slow, setSlow] = useState(false)

  const boxRef = useRef(null)
  const toggledRef = useRef(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const handler = () => {
      toggledRef.current = !toggledRef.current
      safeViewTransition(() => {
        box.classList.toggle('toggled', toggledRef.current)
      })
    }

    box.addEventListener('click', handler)

    return () => {
      box.removeEventListener('click', handler)
    }
  }, [])

  return (
    <>
      Click the box below!
      <div className="container">
        <div className="box" ref={boxRef}>
          HI!
        </div>
      </div>
      <button className="button" onClick={() => setSlow(!slow)}>
        {slow ? 'Fast' : 'Slow'}
      </button>
      <style>{`
        ::view-transition-group(box) {
          animation-duration: ${slow ? '10s' : '0.25s'};
        }
      `}</style>
      <style jsx>{`
        .container {
          height: 200px;
          display: flex;
          align-items: center;
        }

        .box {
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
        }
        .box.toggled {
          width: 120px;
          rotate: 0.5turn;
          background: var(--cyan);
          margin-left: 100px;
        }
        .button {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          background: var(--base-dark);
        }
      `}</style>
    </>
  )
}
