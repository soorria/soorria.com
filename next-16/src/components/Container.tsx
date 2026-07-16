import { type PropsWithChildren } from 'react'
import cx from '~/utils/cx'

const Container = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return <div className={cx('container mx-auto max-w-4xl px-4 md:px-8', className)}>{children}</div>
}

export default Container
