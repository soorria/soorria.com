import cx from '@/utils/cx'
import { useCopy } from '@/utils/use-copy'
import { useHydrated } from '@/utils/use-hydrated'
import React, { useRef } from 'react'
import {
  CodeBlockTitle,
  CODE_BLOCK_CLASSNAMES,
  getTextFromNullablePre,
  LANGUAGE_NAME_MAP,
} from './utils'

const CustomCodeBlock: React.FC<any> = ({
  children,
  className,
  language: languageFromMdx,
  title,
  ...rest
}) => {
  const [copy, copied] = useCopy()
  const pre = useRef<HTMLPreElement>()
  const hydrated = useHydrated()

  if (!className?.includes('shiki')) {
    return <pre className={className}>{children}</pre>
  }

  const language = LANGUAGE_NAME_MAP[languageFromMdx] ?? languageFromMdx

  return (
    <>
      {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
      <div className={cx('shiki', CODE_BLOCK_CLASSNAMES.root, 'shiki')}>
        <div className={CODE_BLOCK_CLASSNAMES.header}>
          <div className={CODE_BLOCK_CLASSNAMES.languageTitle}>{language}</div>
          <div className="flex-1" />
          {hydrated && (
            <button
              type="button"
              className={CODE_BLOCK_CLASSNAMES.button}
              onClick={() => copy(getTextFromNullablePre(pre.current))}
            >
              {copied ? 'copied' : 'copy'}
            </button>
          )}
        </div>
        <pre ref={pre} className={cx(className, CODE_BLOCK_CLASSNAMES.pre)} {...rest}>
          {children}
        </pre>
      </div>{' '}
    </>
  )
}

export default CustomCodeBlock
