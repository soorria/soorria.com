import cx from '~/utils/cx'
import { useHydrated } from '~/utils/use-hydrated'
import { useSyncedLocalStorage } from '~/utils/use-synced-local-storage'
import { Children, isValidElement, ReactElement, useMemo, useRef } from 'react'
import type { CustomCodeBlockProps } from './CodeBlock'
import { CodeBlockPre } from './CodeBlockPre'
import { CodeBlockCopyButton } from './utils'
import {
  CodeBlockTitle,
  CODE_BLOCK_CLASSNAMES,
  getCodeLinesFromPre,
  LANGUAGE_NAME_MAP,
} from './utils'

const TS_LANGUAGES = new Set(['ts', 'tsx', 'typescript'])
const TsJsSwitcher: React.FC = props => {
  const [isTs, setIsTs] = useSyncedLocalStorage<boolean>('soorria.com:isTs', true)
  const hydrated = useHydrated()
  const pre = useRef<HTMLPreElement>(null)

  const { blocks, names } = useMemo(() => {
    const children = Children.toArray(props.children).filter(el =>
      isValidElement(el)
    ) as ReactElement[]

    if (children.length <= 1) return { blocks: [], names: {} }

    const [a, b] = children as [
      ReactElement<CustomCodeBlockProps>,
      ReactElement<CustomCodeBlockProps>
    ]

    const blocks = TS_LANGUAGES.has(a.props.language ?? '') ? ([a, b] as const) : ([b, a] as const)

    const isTsx = blocks[0].props.language === 'tsx'

    return {
      blocks: blocks,
      names: {
        ts: LANGUAGE_NAME_MAP[isTsx ? 'tsx' : 'ts'],
        js: LANGUAGE_NAME_MAP[isTsx ? 'jsx' : 'js'],
      },
    } as const
  }, [props.children])

  if (blocks.length <= 1) return <>{props.children}</>

  const selectedBlock = blocks[isTs ? 0 : 1]!
  const { children, className, title, ...rest } = selectedBlock.props

  return (
    <>
      {title && <CodeBlockTitle>{title}</CodeBlockTitle>}
      <div className={cx('shiki', CODE_BLOCK_CLASSNAMES.root)}>
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
          {hydrated && (
            <>
              <button
                type="button"
                className={CODE_BLOCK_CLASSNAMES.button}
                onClick={() => setIsTs(t => !t)}
              >
                {/**
                 * What should get shown here:
                 *
                 *              < sm => 'to js'
                 * sm <= screen < md => 'switch to js'
                 * md <= screen      => 'switch to javascript'
                 */}
                <span className="hidden sm:inline">switch</span> to{' '}
                <span className="inline-grid overflow-y-hidden">
                  <span
                    className={cx(
                      'col-start-1 row-start-1 transition-transform',
                      isTs && '-translate-y-full'
                    )}
                  >
                    <span className="hidden md:inline">typescript</span>
                    <span className="md:hidden">ts</span>
                  </span>
                  <span
                    className={cx(
                      'col-start-1 row-start-1 transition-transform',
                      !isTs && 'translate-y-full'
                    )}
                  >
                    <span className="hidden md:inline">javascript</span>
                    <span className="md:hidden">js</span>
                  </span>
                </span>
              </button>
              <CodeBlockCopyButton getText={() => getCodeLinesFromPre(pre.current)} />
            </>
          )}
        </div>
        <CodeBlockPre ref={pre} className={className} {...rest}>
          {children}
        </CodeBlockPre>
      </div>
    </>
  )
}

export default TsJsSwitcher
