import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import cx from '~/utils/cx'
import CustomLink from '../CustomLink'

type LandingSectionProps = PropsWithChildren<{
  title: ReactNode
  id: string
  className?: string
  style?: CSSProperties
}>

const LandingSection = ({ title, children, id, className, style }: LandingSectionProps) => {
  return (
    <section
      id={id}
      className={cx('mb-24 mt-8', className)}
      style={{ scrollMarginTop: '1rem', ...style }}
    >
      <h3 className="mb-8 text-4xl font-bold">
        {title}
        <CustomLink href={`#${id}`} className="heading-anchor" aria-hidden="true" tabIndex={-1} />
      </h3>
      {children}
    </section>
  )
}

export default LandingSection
