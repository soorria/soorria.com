import type { ReactNode } from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main role="main" id="main-content" className="flex-1 bg-drac-base">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
