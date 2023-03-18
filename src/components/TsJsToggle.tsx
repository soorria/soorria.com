import { Dispatch, SetStateAction } from 'react'
import cx from '~/utils/cx'
import { useSyncedLocalStorage } from '~/utils/use-synced-local-storage'
import { CODE_BLOCK_CLASSNAMES } from './mdx/utils'

export const useIsTs = (): [boolean, Dispatch<SetStateAction<boolean>>] =>
  useSyncedLocalStorage<boolean>('soorria.com:isTs', true)

export const TsJsToggle: React.FC<{ responsive?: boolean }> = props => {
  const responsive = props.responsive ?? true
  const [isTs, setIsTs] = useIsTs()

  const switchTextClass = responsive ? 'hidden sm:inline' : ''
  const langTextClass = responsive ? 'hidden md:inline' : ''

  return (
    <button type="button" className={CODE_BLOCK_CLASSNAMES.button} onClick={() => setIsTs(t => !t)}>
      {/**
       * What should get shown here:
       *
       *              < sm => 'to js'
       * sm <= screen < md => 'switch to js'
       * md <= screen      => 'switch to javascript'
       */}
      <span className={switchTextClass}>switch</span> to{' '}
      <span className="inline-grid overflow-y-hidden">
        <span
          className={cx(
            'col-start-1 row-start-1 transition-transform',
            isTs && '-translate-y-full'
          )}
        >
          <span className={langTextClass}>typescript</span>
          {responsive && <span className="md:hidden">ts</span>}
        </span>
        <span
          className={cx(
            'col-start-1 row-start-1 transition-transform',
            !isTs && 'translate-y-full'
          )}
        >
          <span className={langTextClass}>javascript</span>
          {responsive && <span className="md:hidden">js</span>}
        </span>
      </span>
    </button>
  )
}

export const OnlyIsTs: React.FC<{ isTs: boolean; children: React.ReactNode }> = props => {
  const [isTs] = useIsTs()
  return <>{isTs === props.isTs ? props.children : null}</>
}
