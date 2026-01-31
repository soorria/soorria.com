import type { ReactNode } from 'react'
import cx from '~/utils/cx'

export const SlightBleedContentWrapper = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={cx('relative -mx-2 md:-mx-6', className)}>{children}</div>
}
