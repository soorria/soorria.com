import cx from '~/utils/cx'
import { forwardRef, HTMLAttributes, PropsWithChildren, useState } from 'react'
import { CODE_BLOCK_CLASSNAMES, getTruncationHeight } from './utils'

export type CodeBlockPreExtraProps = { truncate?: boolean | number | string }
export type CodeBlockPreProps = PropsWithChildren<
  CodeBlockPreExtraProps & HTMLAttributes<HTMLPreElement>
>
export const CodeBlockPre = forwardRef<HTMLPreElement, CodeBlockPreProps>(
  ({ className, truncate, children, ...rest }, ref) => {
    const [expanded, setExpanded] = useState(false)
    return (
      <pre
        ref={ref}
        className={cx(className, CODE_BLOCK_CLASSNAMES.pre)}
        {...rest}
        style={
          truncate && !expanded
            ? {
                maxHeight: getTruncationHeight(truncate),
                paddingBottom: '2.5rem',
              }
            : {}
        }
      >
        {children}
        {truncate && !expanded && (
          <button
            className={cx(
              'absolute bottom-4 left-1/2 -translate-x-1/2 opacity-90 shadow hover:opacity-100',
              CODE_BLOCK_CLASSNAMES.button
            )}
            onClick={() => setExpanded(true)}
          >
            expand
          </button>
        )}
      </pre>
    )
  }
)
CodeBlockPre.displayName = 'CodeBlockPre'
