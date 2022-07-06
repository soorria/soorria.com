import cx from '@/utils/cx'
import { useCopy } from '@/utils/use-copy'
import { useSyncedLocalStorage } from '@/utils/use-synced-local-storage'
import React, { Children, useMemo, useRef, isValidElement, ReactElement } from 'react'
import { COMMON_CLASSNAMES } from './utils'

const LANGUAGE_NAME_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript react',
  ts: 'typescript',
  tsx: 'typescript react',
  md: 'markdown',
}

const classes = {
  button:
    'rounded bg-drac-purple px-2 font-bold tracking-wider text-drac-bg focus:outline-none focus:ring-2 focus:ring-drac-purple focus:ring-offset-2 focus:ring-offset-current',
  root: cx('my-7 !pb-0', COMMON_CLASSNAMES.codeAndDemoRoot),
  pre: '!my-0',
  header: 'mb-4 flex items-center space-x-2 font-display text-sm font-bold tracking-wide',
  languageTitle: 'text-sm uppercase text-drac-purple sm:text-sm',
}

const getTextFromNullablePre = (pre: HTMLPreElement | undefined | null): string => {
  if (!pre) return ''

  const firstCodeChild = Array.from(pre.children).find((el: Element) => el.tagName === 'CODE')
  if (!firstCodeChild) return pre.innerText

  return Array.from(firstCodeChild.children)
    .map(line => (line as HTMLElement).innerText || '')
    .join()
}

const CustomCodeBlock: React.FC<any> = ({ children, className, ...rest }) => {
  const [copy, copied] = useCopy()
  const pre = useRef<HTMLPreElement>()

  if (className?.includes('not-custom')) {
    return <pre className={className}>{children}</pre>
  }

  const languageFromClassName: string = className.split('language-')[1]
  const language = LANGUAGE_NAME_MAP[languageFromClassName] ?? languageFromClassName

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.languageTitle}>{language}</div>
        <div className="flex-1" />
        <button
          type="button"
          className={classes.button}
          onClick={() => copy(getTextFromNullablePre(pre.current))}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre ref={pre} className={cx(className, classes.pre)} {...rest}>
        {children}
      </pre>
    </div>
  )
}

export default CustomCodeBlock

const TS_CLASSNAMES = new Set(['language-ts', 'language-tsx', 'language-typescript'])
export const TsJsSwitcher: React.FC = props => {
  const [isTs, setIsTs] = useSyncedLocalStorage('scom:isTs', true)
  const [copy, copied] = useCopy()
  const pre = useRef<HTMLPreElement>(null)

  const { blocks, isTsx } = useMemo(() => {
    const children = Children.toArray(props.children).filter(el =>
      isValidElement(el)
    ) as ReactElement[]

    if (children.length <= 1) return { blocks: [] }

    const [a, b] = children as [ReactElement, ReactElement]

    const [ts, js] = TS_CLASSNAMES.has(a.props.className) ? [a, b] : [b, a]

    return { blocks: [ts, js], isTsx: ts.props.className === 'language-tsx' }
  }, [props.children])

  if (blocks.length <= 1) return <>{props.children}</>

  const selectedBlock = blocks[isTs ? 0 : 1]!
  const { children, className } = selectedBlock.props

  return (
    <div className={cx('my-7 !pb-0', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      <div className={classes.header}>
        <div className={classes.languageTitle}>
          {LANGUAGE_NAME_MAP[`${isTs ? 't' : 'j'}s${isTsx ? 'x' : ''}`]}
        </div>
        <div className="flex-1" />
        <button type="button" className={classes.button} onClick={() => setIsTs(t => !t)}>
          <span className="hidden sm:inline">switch</span> to {isTs ? 'js' : 'ts'}
        </button>
        <button
          type="button"
          className={classes.button}
          onClick={() => copy(getTextFromNullablePre(pre.current))}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre ref={pre} className={cx(className, classes.pre)}>
        {children}
      </pre>
    </div>
  )
}
