import cx from '~/utils/cx'
import { useHydrated } from '~/utils/use-hydrated'
import React, { PropsWithChildren, ReactNode, useRef } from 'react'
import { CodeBlockPre, CodeBlockPreExtraProps } from './CodeBlockPre'
import {
  CodeBlockCopyButton,
  CodeBlockTitle,
  CODE_BLOCK_CLASSNAMES,
  getCodeLinesFromPre,
  LANGUAGE_NAME_MAP,
} from './utils'

export type CustomCodeBlockProps = PropsWithChildren<
  {
    className: string
    language?: string
    title?: ReactNode
  } & CodeBlockPreExtraProps
>

const CustomCodeBlock: React.FC<CustomCodeBlockProps> = ({
  children,
  className,
  language: languageFromMdx,
  title,
  ...rest
}) => {
  const pre = useRef<HTMLPreElement>(null)
  const hydrated = useHydrated()

  if (!className?.includes('shiki')) {
    return <pre className={className}>{children}</pre>
  }

  const language = (languageFromMdx && LANGUAGE_NAME_MAP[languageFromMdx]) ?? languageFromMdx

  return (
    <>
      {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
      <div className={cx('shiki', CODE_BLOCK_CLASSNAMES.root)}>
        <div className={CODE_BLOCK_CLASSNAMES.header}>
          <div className={CODE_BLOCK_CLASSNAMES.languageTitle}>{language}</div>
          <div className="flex-1" />
          {hydrated && <CodeBlockCopyButton getText={() => getCodeLinesFromPre(pre.current)} />}
        </div>
        <CodeBlockPre ref={pre} className={className} {...rest}>
          {children}
        </CodeBlockPre>
      </div>
    </>
  )
}

export default CustomCodeBlock