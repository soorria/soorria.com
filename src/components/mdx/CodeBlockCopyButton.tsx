'use client'

import type { MouseEvent } from 'react'
import cx from '~/utils/cx'
import { useCopy } from '~/utils/use-copy'
import { CODE_BLOCK_CLASSNAMES } from './utils'
import { useTrackFirstEvent } from '~/lib/analytics'

const getCodeLinesFromPre = (pre: HTMLPreElement | undefined | null): string => {
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
  const track = useTrackFirstEvent()

  const handleCopy = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    const parent = clickEvent.currentTarget.closest(parentSelector)
    const pre = Array.from(parent?.querySelectorAll<HTMLPreElement>(preSelector) ?? []).find(
      el => window.getComputedStyle(el).display !== 'none'
    )

    if (!pre || !parent) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Could not find pre element to copy from. This shouldn't happen.")
      }
      return ''
    }

    copy(getCodeLinesFromPre(pre))

    const codeBlockIndex = Array.from(document.querySelectorAll('.code-block')).indexOf(parent)
    track('Clicked code block copy button', {
      props: { id: [window.location.pathname, codeBlockIndex, pre.dataset.language].join(':') },
    })
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
