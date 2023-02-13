import { PropsWithChildren } from 'react'
import Container from './Container'

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <div className="py-8">{children}</div>
    </Container>
  )
}

export default MainLayout
