'use client'
import { useRef } from 'react'
import cx from '~/utils/cx'
import { useFullscreen } from '~/utils/use-fullscreen'

export const Example = () => {
  const [fullscreenElement, fullscreenControls] = useFullscreen()
  const containerRef = useRef<HTMLDivElement>(null)

  const classes = {
    button:
      'rounded bg-drac-base-light px-2 py-1 hover:bg-drac-base-dark transition text-drac-pink hover:text-drac-purple text-center',
  }

  let text = 'No current fullscreen element'
  if (fullscreenElement === document.body) {
    text = "The current fullscreen element is the document's body"
  } else if (
    fullscreenElement === containerRef.current &&
    containerRef.current !== null
  ) {
    text = 'The current fullscreen element is the demo container'
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-stretch justify-center gap-6"
    >
      <p className="text-center text-xl">{text}</p>

      <div className="grid grid-cols-2 gap-4">
        <button
          className={classes.button}
          onClick={() => fullscreenControls.enter(document.body)}
        >
          Enter fullscreen for <code>document.body</code>
        </button>
        <button
          className={classes.button}
          onClick={() => fullscreenControls.toggle(document.body)}
        >
          Toggle fullscreen for <code>document.body</code>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          className={classes.button}
          onClick={() => fullscreenControls.enter(containerRef.current!)}
        >
          Enter fullscreen for demo content
        </button>
        <button
          className={classes.button}
          onClick={() => fullscreenControls.toggle(containerRef.current!)}
        >
          Toggle fullscreen for demo content
        </button>
      </div>

      <button
        className={cx(classes.button, 'text-center')}
        onClick={() => fullscreenControls.exit()}
      >
        Exit fullscreen
      </button>
    </div>
  )
}
