const resetTimers = new WeakMap<HTMLButtonElement, number>()

export const getCodeText = (pre: HTMLPreElement) => {
  const code = pre.querySelector('code')
  return code
    ? Array.from(code.children)
        .map(line => (line as HTMLElement).innerText || '')
        .join('\n')
    : pre.innerText
}

export const showCopiedState = (button: HTMLButtonElement) => {
  const previousTimer = resetTimers.get(button)
  if (previousTimer) window.clearTimeout(previousTimer)

  button.dataset.copyState = 'copied'
  resetTimers.set(
    button,
    window.setTimeout(() => {
      button.dataset.copyState = 'idle'
      resetTimers.delete(button)
    }, 1500)
  )
}
