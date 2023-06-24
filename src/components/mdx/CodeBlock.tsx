import cx from '~/utils/cx'
import React, { PropsWithChildren, ReactNode } from 'react'
import { CodeBlockPre, CodeBlockPreExtraProps } from './CodeBlockPre'
import { CodeBlockTitle, CODE_BLOCK_CLASSNAMES, LANGUAGE_NAME_MAP } from './utils'
import { CodeBlockCopyButton } from './CodeBlockCopyButton'

export type CustomCodeBlockProps = PropsWithChildren<
  {
    className: string
    'data-language'?: string
    'data-theme'?: string
    'data-title'?: ReactNode
    'data-wrapper'?: boolean
  } & CodeBlockPreExtraProps
>

const CodeBlock = (props: CustomCodeBlockProps) => {
  const {
    'data-language': languageFromMdx,
    'data-wrapper': noWrapper,
    'data-theme': theme,
    'data-title': title,
  } = props

  if (!theme || noWrapper) {
    return <CodeBlockPre {...props} />
  }

  const language = (languageFromMdx && LANGUAGE_NAME_MAP[languageFromMdx]) ?? languageFromMdx

  return (
    <>
      {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
      <div className={cx('code-block', CODE_BLOCK_CLASSNAMES.root)}>
        <div className={CODE_BLOCK_CLASSNAMES.header}>
          <div className={CODE_BLOCK_CLASSNAMES.languageTitle}>{language}</div>
          <div className="flex-1" />
          <CodeBlockCopyButton parentSelector=".code-block" />
        </div>
        <CodeBlockPre {...props} />
      </div>
    </>
  )
}

export default CodeBlock
