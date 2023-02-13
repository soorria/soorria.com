import type { PropsWithChildren, ReactNode } from 'react'
import CustomLink from '../CustomLink'

type LandingSectionProps = PropsWithChildren<{
  title: ReactNode
  id?: string
}>

const LandingSection: React.FC<LandingSectionProps> = ({ title, children, id }) => {
  return (
    <section id={id} className="mt-8 mb-24" style={{ scrollMarginTop: '1rem' }}>
      <h3 className="mb-8 text-4xl font-bold">
        {title}
        <CustomLink href={`#${id}`} className="heading-anchor" aria-hidden="true" tabIndex={-1} />
      </h3>
      {children}
    </section>
  )
}

export default LandingSection
