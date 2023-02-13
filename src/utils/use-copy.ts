import { Accessor, createSignal } from 'solid-js'

export type UseCopyProps = {
  copiedTimeout?: number
}

type CopyFn = (text: string) => Promise<void>

export const useCopy = (props?: UseCopyProps): [copy: CopyFn, copied: Accessor<boolean>] => {
  const [copied, setCopied] = createSignal(false)
  let timeoutRef: ReturnType<typeof setTimeout> | undefined

  const copy: CopyFn = async text => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    if (timeoutRef) clearTimeout(timeoutRef)
    timeoutRef = setTimeout(() => setCopied(false), props?.copiedTimeout ?? 2000)
  }

  return [copy, copied]
}
