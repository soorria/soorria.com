import { css } from 'goober'
import { Accessor, createEffect, createSignal } from 'solid-js'

export const createExample = () => {
  const createPreviousMemo = <T,>(
    get: Accessor<T>
  ): Accessor<T | undefined> => {
    let currValue: T | undefined = undefined
    const [prev, setPrev] = createSignal<T | undefined>()
    createEffect(() => {
      const nextValue = currValue
      setPrev(() => nextValue)
      currValue = get()
    })
    return prev
  }
  return {
    component: () => {
      const [count, setCount] = createSignal(0)
      const previousCount = createPreviousMemo(count)

      return (
        <div
          class="not-prose"
          style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
          }}
        >
          <button
            onClick={() => setCount(c => c + 1)}
            class={css({
              padding: '0.75rem 1rem',
              background: 'var(--base-light)',
              transition: '150ms background ease-in-out',
              borderRadius: '4px',
              '&:hover,&:focus-visible': {
                background: 'var(--base-dark)',
              },
            })}
          >
            Increment
          </button>

          <div
            style={{
              'min-width': '165px',
              'font-variant-numeric': 'tabular-nums',
            }}
          >
            <p style={{ display: 'flex', 'justify-content': 'space-between' }}>
              Current: {count()}
            </p>
            <p style={{ display: 'flex', 'justify-content': 'space-between' }}>
              Current: {previousCount()}
            </p>
          </div>
        </div>
      )
    },
  }
}
