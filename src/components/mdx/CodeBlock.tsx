import { JSXElement, ParentComponent, Show, splitProps } from 'solid-js'

import cx from '~/utils/cx'
import { useHydrated } from '~/utils/use-hydrated'

import { CodeBlockPre, CodeBlockPreExtraProps } from './CodeBlockPre'
import {
  CODE_BLOCK_CLASSNAMES,
  CodeBlockCopyButton,
  CodeBlockTitle,
  getCodeLinesFromPre,
  LANGUAGE_NAME_MAP,
} from './utils'

export type CustomCodeBlockProps = {
  class: string
  language?: string
  title?: JSXElement
} & CodeBlockPreExtraProps

const CustomCodeBlock: ParentComponent<CustomCodeBlockProps> = props => {
  const [, rest] = splitProps(props, ['children', 'class', 'language', 'title'])
  let pre: HTMLPreElement | undefined
  const hydrated = useHydrated()

  const language = (props.language && LANGUAGE_NAME_MAP[props.language]) ?? props.language

  return (
    <Show
      when={props.class?.includes('shiki')}
      fallback={<pre class={props.class}>{props.children}</pre>}
    >
      <Show when={props.title}>
        <CodeBlockTitle>{props.title}</CodeBlockTitle>
      </Show>
      <div class={cx('shiki', CODE_BLOCK_CLASSNAMES.root)}>
        <div class={CODE_BLOCK_CLASSNAMES.header}>
          <div class={CODE_BLOCK_CLASSNAMES.languageTitle}>{language}</div>
          <div class="flex-1" />
          <Show when={hydrated()}>
            <CodeBlockCopyButton getText={() => getCodeLinesFromPre(pre)} />
          </Show>
        </div>
        <CodeBlockPre ref={pre} class={props.class} {...rest}>
          {props.children}
        </CodeBlockPre>
      </div>
    </Show>
  )
}

export default CustomCodeBlock
