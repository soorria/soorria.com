'use client'

import { css } from 'goober'

export const createExample: import('~/components/mdx/SolidDemo').CreateSolidDemo =
  s => {
    const { h, createSignal, createEffect } = s

    const createPreviousMemo = <T,>(get: import('solid-js').Accessor<T>) => {
      let currValue: T | undefined = undefined
      const [prev, setPrev] = createSignal()
      createEffect(() => {
        const nextValue = currValue
        setPrev(() => nextValue)
        currValue = get()
      })
      return prev
    }
    return {
      component: () => {
        const [count, setCount] = s.createSignal(0)
        const previousCount = createPreviousMemo(count)

        return h(
          'div.not-prose',
          {
            style: {
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'space-between',
            },
          },
          h(
            'button',
            {
              onClick: (_: any) => setCount(c => c + 1),
              class: css({
                padding: '0.75rem 1rem',
                background: 'var(--base-light)',
                transition: '150ms background ease-in-out',
                borderRadius: '4px',
                '&:hover,&:focus-visible': {
                  background: 'var(--base-dark)',
                },
              }),
            },
            'Increment'
          ),
          h(
            'div',
            { style: 'min-width: 165px; font-variant-numeric: tabular-nums;' },
            h(
              'p',
              { style: 'display: flex; justify-content: space-between' },
              `Current: `,
              h('span', count)
            ),
            h(
              'p',
              { style: 'display: flex; justify-content: space-between' },
              `Previous: `,
              h('span', () => `${previousCount()}`)
            )
          )
        )
      },
    }
  }
