import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  ParentComponent,
} from 'solid-js'

interface UseIsMouseInactiveOptions {
  timeout?: number
  root: Element
}

// @ts-check
export const createExample = () => {
  const useIsMouseInactive = (props: UseIsMouseInactiveOptions) => {
    const [inactive, setInactive] = createSignal(false)
    let timer: NodeJS.Timeout

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

  const Content: ParentComponent = props => {
    return (
      <p>
        Your mouse {props.children} over the viewport in the last{' '}
        {TIMEOUT_SECONDS} seconds
      </p>
    )
  }

  return {
    component: () => {
      const isMouseInactive = useIsMouseInactive({
        timeout: TIMEOUT_SECONDS * 1000,
        root: window,
      })

      return (
        <div
          style={{
            display: 'grid',
            'place-items': 'center',
            position: 'relative',
            height: '64px',
          }}
        >
          <div style={CONTENT_WRAPPER_STYLE}>
            <Content>
              <b style={{ color: 'var(--purple)' }}> has moved</b>
            </Content>
          </div>
          <div
            style={{
              ...CONTENT_WRAPPER_STYLE,
              transition: '50ms opacity ease-in-out',
              opacity: isMouseInactive() ? 1 : 0,
            }}
          >
            <Content>
              <b style={{ color: 'var(--purple)' }}> hasn't moved</b>
            </Content>
          </div>
        </div>
      )
    },
  }
}
