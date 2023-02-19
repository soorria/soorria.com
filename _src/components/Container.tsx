import { PropsWithChildren } from 'react'

const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="container mx-auto max-w-4xl px-4 md:px-8">{children}</div>
}

export default Container