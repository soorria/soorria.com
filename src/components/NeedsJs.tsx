import { createSignal, JSXElement, onMount, ParentComponent } from 'solid-js'

const NeedsJs: ParentComponent<{ fallback: JSXElement }> = props => {
  const [mounted, setMounted] = createSignal(false)

  onMount(() => {
    setMounted(true)
  })

  return (
    <>
      {props.fallback && <noscript>{props.fallback}</noscript>}
      {mounted() ? props.children : null}
    </>
  )
}

export default NeedsJs
