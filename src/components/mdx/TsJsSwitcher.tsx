import cx from '@/utils/cx'
import { useCopy } from '@/utils/use-copy'
import { useHydrated } from '@/utils/use-hydrated'
import { useSyncedLocalStorage } from '@/utils/use-synced-local-storage'
import { Children, isValidElement, ReactElement, useMemo, useRef } from 'react'
import {
  CodeBlockTitle,
  CODE_BLOCK_CLASSNAMES,
  getTextFromNullablePre,
  LANGUAGE_NAME_MAP,
} from './utils'

const TS_LANGUAGES = new Set(['ts', 'tsx', 'typescript'])
const TsJsSwitcher: React.FC = props => {
  const [isTs, setIsTs] = useSyncedLocalStorage('scom:isTs', true)
  const [copy, copied] = useCopy()
  const hydrated = useHydrated()
  const pre = useRef<HTMLPreElement>(null)

  const { blocks, isTsx } = useMemo(() => {
    const children = Children.toArray(props.children).filter(el =>
      isValidElement(el)
    ) as ReactElement[]

    if (children.length <= 1) return { blocks: [] }

    const [a, b] = children as [ReactElement, ReactElement]

    const [ts, js] = TS_LANGUAGES.has(a.props.language) ? [a, b] : [b, a]

    return { blocks: [ts, js], isTsx: ts.props.language === 'tsx' }
  }, [props.children])

  if (blocks.length <= 1) return <>{props.children}</>

  const selectedBlock = blocks[isTs ? 0 : 1]!
  const { children, className, title } = selectedBlock.props

  return (
    <>
      {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
      <div className={cx('shiki', CODE_BLOCK_CLASSNAMES.root)}>
        <div className={CODE_BLOCK_CLASSNAMES.header}>
          <div className={CODE_BLOCK_CLASSNAMES.languageTitle}>
            {LANGUAGE_NAME_MAP[`${isTs ? 't' : 'j'}s${isTsx ? 'x' : ''}`]}
          </div>
          <div className="flex-1" />
          {hydrated && (
            <>
              <button
                type="button"
                className={CODE_BLOCK_CLASSNAMES.button}
                onClick={() => setIsTs(t => !t)}
              >
                <span className="hidden sm:inline">switch</span> to {isTs ? 'js' : 'ts'}
              </button>
              <button
                type="button"
                className={CODE_BLOCK_CLASSNAMES.button}
                onClick={() => copy(getTextFromNullablePre(pre.current))}
              >
                {copied ? 'copied' : 'copy'}
              </button>
            </>
          )}
        </div>
        <pre ref={pre} className={cx(className, CODE_BLOCK_CLASSNAMES.pre)}>
          {children}
        </pre>
      </div>
    </>
  )
}

export default TsJsSwitcher
