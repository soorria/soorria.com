'use client'

// @ts-check
/** @type {import('../../../src/components/mdx/SolidDemo').CreateSolidDemo} */
export const createExample = ({
  h,
  createSignal,
  createEffect,
  onCleanup,
  onMount,
}) => {
  const useIsMouseInactive = (props = {}) => {
    const [inactive, setInactive] = createSignal(false)
    let timer

    const onMouseMove = () => {
      setInactive(false)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        setInactive(true)
      }, props.timeout ?? 5000)
    }

    createEffect(() => {
      const el = props.root
      if (!el) return

      onMount(() => {
        el.addEventListener('mousemove', onMouseMove)
        onMouseMove()
      })

      onCleanup(() => {
        el.removeEventListener('mousemove', onMouseMove)
      })
    })

    return inactive
  }

  const TIMEOUT_SECONDS = 2
  const CONTENT_WRAPPER_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--base)',
    display: 'grid',
    'place-items': 'center',
  }

  const Content = props => {
    return h(
      'p',
      'Your mouse',
      () => props.children,
      `over the viewport in the last ${TIMEOUT_SECONDS} seconds`
    )
  }

  return {
    component: () => {
      const isMouseInactive = useIsMouseInactive({
        timeout: TIMEOUT_SECONDS * 1000,
        root: window,
      })

      return h(
        'div',
        {
          style: {
            display: 'grid',
            'place-items': 'center',
            position: 'relative',
            height: '64px',
          },
        },

        h(
          'div',
          {
            style: CONTENT_WRAPPER_STYLE,
          },
          h(Content, h('b', { style: 'color: var(--purple)' }, ' has moved '))
        ),
        h(
          'div',
          {
            style: () => ({
              ...CONTENT_WRAPPER_STYLE,
              transition: '50ms opacity ease-in-out',
              opacity: isMouseInactive() ? 1 : 0,
            }),
          },
          h(Content, h('b', { style: 'color: var(--pink)' }, " hasn't moved "))
        )
      )
    },
  }
}
