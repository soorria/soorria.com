import type React from 'react'
import cx from '@/utils/cx'
import { useCopy } from '@/utils/use-copy'

export const COMMON_CLASSNAMES = {
  codeAndDemoRoot:
    'relative -mx-2 rounded p-2 ring-2 ring-drac-purple md:-mx-6 md:py-4 md:px-6 bg-drac-base',
} as const

export const CODE_BLOCK_CLASSNAMES = {
  button:
    'rounded bg-drac-purple px-2 font-bold tracking-wider text-drac-base focus:outline-none focus:ring-2 focus:ring-drac-pink focus:ring-offset-2 focus:ring-offset-current text-center transition text-sm font-bold font-display',
  root: cx('my-7 !pb-0 overflow-hidden', COMMON_CLASSNAMES.codeAndDemoRoot),
  pre: '!my-0',
  header: 'mb-4 flex items-center space-x-2 font-display text-sm font-bold tracking-wide',
  languageTitle: 'text-sm uppercase text-drac-purple sm:text-sm',
} as const

const CODE_LINE_HEIGHT = 28
export const DEFAULT_TRUNCATE_HEIGHT = 10.5 * CODE_LINE_HEIGHT

export const getTruncationHeight = (
  truncate: string | number | boolean | undefined
): string | number | undefined => {
  if (typeof truncate === 'number') return (truncate + 0.5) * CODE_LINE_HEIGHT
  if (!truncate) return undefined
  if (truncate === true || truncate === 'true') return DEFAULT_TRUNCATE_HEIGHT
  const asNumber = parseInt(truncate)
  if (Number.isSafeInteger(asNumber)) return (asNumber + 0.5) * CODE_LINE_HEIGHT
  return truncate
}

export const getCodeLinesFromPre = (pre: HTMLPreElement | undefined | null): string => {
  if (!pre) return ''

  const firstCodeChild = Array.from(pre.children).find((el: Element) => el.tagName === 'CODE')
  if (!firstCodeChild) return pre.innerText

  return Array.from(firstCodeChild.children)
    .map(line => (line as HTMLElement).innerText || '')
    .join('\n')
}

export const LANGUAGE_NAME_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  md: 'markdown',
}

export const CodeBlockTitle: React.FC<{ children: React.ReactNode }> = props => (
  <div className="code-block-title -mb-[1.7rem] rounded rounded-b-none font-display text-sm font-bold text-drac-base">
    <span className="inline-block rounded rounded-b-none bg-drac-purple px-3 py-0.5">
      {props.children}
    </span>
  </div>
)

export const CodeBlockCopyButton: React.FC<{ getText(): string }> = ({ getText }) => {
  const [copy, copied] = useCopy()
  return (
    <button type="button" className={CODE_BLOCK_CLASSNAMES.button} onClick={() => copy(getText())}>
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
