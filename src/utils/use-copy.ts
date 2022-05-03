import { useState, useCallback, useRef } from 'react'

export type UseCopyProps = {
  copiedTimeout?: number
}

type CopyFn = (text: string) => Promise<void>

export const useCopy = ({ copiedTimeout = 2000 }: UseCopyProps = {}): [
  copy: CopyFn,
  copied: boolean
] => {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const copy: CopyFn = useCallback(
    async text => {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), copiedTimeout)
    },
    [copiedTimeout]
  )

  return [copy, copied]
}
