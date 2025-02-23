'use client'

import cx from '~/utils/cx'
import { type PropsWithChildren } from 'react'
import { CodeBlockTitle, CODE_BLOCK_CLASSNAMES, LANGUAGE_NAME_MAP } from './utils'
import { TsJsToggle, useIsTs } from '../TsJsToggle'
import { CodeBlockCopyButton } from './CodeBlockCopyButton'

const TsJsSwitcher = ({
  'data-title': title,
  'data-jsx': isJsx,
  children,
}: PropsWithChildren<{
  'data-title'?: string
  'data-caption'?: string
  'data-jsx'?: 'true' | 'false'
}>) => {
  const [isTs] = useIsTs()

  const names =
    isJsx === 'true'
      ? { ts: LANGUAGE_NAME_MAP.tsx, js: LANGUAGE_NAME_MAP.jsx }
      : { ts: LANGUAGE_NAME_MAP.ts, js: LANGUAGE_NAME_MAP.js }

  return (
    <>
      {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
      <div
        className={cx('code-block ts-js-switcher', isTs || 'show-js', CODE_BLOCK_CLASSNAMES.root)}
      >
        <div className={CODE_BLOCK_CLASSNAMES.header}>
          <div className={CODE_BLOCK_CLASSNAMES.languageTitle}>
            <span className="inline-grid overflow-y-hidden">
              <span
                className={cx(
                  'col-start-1 row-start-1 transition-transform',
                  !isTs && '-translate-y-full'
                )}
              >
                {names.ts}
              </span>
              <span
                className={cx(
                  'col-start-1 row-start-1 transition-transform',
                  isTs && 'translate-y-full'
                )}
              >
                {names.js}
              </span>
            </span>
          </div>
          <div className="flex-1" />
          <TsJsToggle />
          <CodeBlockCopyButton parentSelector=".code-block" />
        </div>
        {children}
      </div>
    </>
  )
}

export default TsJsSwitcher
