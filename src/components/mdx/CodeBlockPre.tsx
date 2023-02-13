import cx from '~/utils/cx'
import { CODE_BLOCK_CLASSNAMES, getTruncationHeight } from './utils'
import { ComponentProps, createSignal, ParentComponent, Show, splitProps } from 'solid-js'

export type CodeBlockPreExtraProps = { truncate?: boolean | number | string }
export type CodeBlockPreProps = CodeBlockPreExtraProps & ComponentProps<'pre'>

export const CodeBlockPre: ParentComponent<CodeBlockPreProps> = props => {
  const [, rest] = splitProps(props, ['children', 'truncate'])

  const [expanded, setExpanded] = createSignal(false)
  return (
    <pre
      class={cx(props.class, CODE_BLOCK_CLASSNAMES.pre)}
      {...rest}
      style={
        props.truncate && !expanded()
          ? {
              'max-height': getTruncationHeight(props.truncate),
              'padding-bottom': '2.5rem',
            }
          : {}
      }
    >
      {props.children}
      <Show when={props.truncate && !expanded()}>
        <button
          class={cx(
            'absolute bottom-4 left-1/2 -translate-x-1/2 opacity-90 shadow hover:opacity-100',
            CODE_BLOCK_CLASSNAMES.button
          )}
          onClick={() => setExpanded(true)}
        >
          See all code
        </button>
      </Show>
    </pre>
  )
}
