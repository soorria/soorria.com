'use client'

import { MouseEvent } from 'react'
import cx from '~/utils/cx'
import { useCopy } from '~/utils/use-copy'
import { CODE_BLOCK_CLASSNAMES } from './utils'

export const getCodeLinesFromPre = (pre: HTMLPreElement | undefined | null): string => {
  if (!pre) return ''

  const firstCodeChild = Array.from(pre.children).find((el: Element) => el.tagName === 'CODE')
  if (!firstCodeChild) return pre.innerText

  return Array.from(firstCodeChild.children)
    .map(line => (line as HTMLElement).innerText || '')
    .join('\n')
}

export const CodeBlockCopyButton: React.FC<{ parentSelector: string; preSelector?: string }> = ({
  parentSelector,
  preSelector = 'pre:not(.hidden)',
}) => {
  const [copy, copied] = useCopy()

  const handleCopy = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    const parent = clickEvent.currentTarget.closest(parentSelector)
    const pre = parent?.querySelector<HTMLPreElement>(preSelector)

    if (!pre) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Could not find pre element to copy from. This shouldn't happen.")
      }
      return ''
    }

    copy(getCodeLinesFromPre(pre))
  }

  return (
    <button type="button" className={CODE_BLOCK_CLASSNAMES.button} onClick={handleCopy}>
      <span className="inline-grid overflow-hidden">
        <span
          className={cx(
            'col-start-1 row-start-1 transition-transform',
            copied && '-translate-y-full'
          )}
        >
          copy
        </span>
        <span
          className={cx(
            'col-start-1 row-start-1 transition-transform',
            !copied && 'translate-y-full'
          )}
        >
          copied
        </span>
      </span>
    </button>
  )
}
