import { ReactNode } from 'react'

interface LandingSectionProps {
  title: ReactNode
  id?: string
}

const LandingSection: React.FC<LandingSectionProps> = ({ title, children, id }) => {
  return (
    <section id={id} className="mt-8 mb-24" style={{ scrollMarginTop: '1rem' }}>
      <h3 className="mb-8 text-4xl font-bold font-display">{title}</h3>
      {children}
    </section>
  )
}

export default LandingSection
