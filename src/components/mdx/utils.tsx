import type React from 'react'
import cx from '~/utils/cx'

export const COMMON_CLASSNAMES = {
  codeAndDemoRoot:
    'relative -mx-2 rounded p-2 ring-2 ring-drac-purple md:-mx-6 md:py-4 md:px-6 bg-drac-base',
} as const

export const CODE_BLOCK_CLASSNAMES = {
  button:
    'rounded bg-drac-purple px-2 font-bold tracking-wider text-drac-base focus:outline-none focus:ring-2 focus:ring-drac-pink focus:ring-offset-2 focus:ring-offset-current text-center transition text-sm font-bold font-display cursor-pointer',
  root: cx('my-7 !pb-0 overflow-hidden', COMMON_CLASSNAMES.codeAndDemoRoot),
  pre: '!my-0',
  header: 'mb-4 flex items-center space-x-2 font-display text-sm font-bold tracking-wide',
  languageTitle: 'text-sm uppercase text-drac-purple sm:text-sm',
} as const

export const DEMO_CLASSNAMES = {
  root: COMMON_CLASSNAMES.codeAndDemoRoot,
  reload:
    'focus-ring flex h-full w-full items-center justify-center rounded bg-drac-base text-drac-pink transition hocus:bg-drac-base-dark hocus:text-drac-purple',
  footer: 'absolute inset-x-0 bottom-0 h-20 bg-drac-purple/50 p-4 md:px-6',
  spacing: 'h-24',
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
