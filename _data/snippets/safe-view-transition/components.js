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
  const [differentTransitionName, setDifferentTransitionName] = useState(false)

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
      Click the box to see it move and grow! If you toggle the animation speed,
      you can see how animated elements' content is handled with and without a
      separate <code>view-transition-name</code>.
      <div className="container">
        <button className="box" ref={boxRef}>
          <span className={differentTransitionName ? 'box-content' : ''}>
            HI!
          </span>
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <button className="button" onClick={() => setSlow(!slow)}>
          Toggle animation speed to {slow ? 'fast' : 'slow'}
        </button>
        <button
          className="button"
          onClick={() => setDifferentTransitionName(!differentTransitionName)}
        >
          Toggle to {differentTransitionName ? 'no' : 'different'} content
          transition name
        </button>
      </div>
      <style>{`
        ::view-transition-group(*) {
          animation-duration: ${slow ? '10s' : '0.25s'};
        }
      `}</style>
      <style jsx>{`
        .container {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .container:has(.toggled) {
          justify-content: flex-end;
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
          font-size: 0.875rem;
        }

        .box-content {
          view-transition-name: box-content;
        }
      `}</style>
    </>
  )
}
