import { PropsWithChildren, useEffect, useState } from 'react'

type NeedsJsProps = PropsWithChildren<{
  fallback: React.ReactNode
}>

const NeedsJs: React.FC<NeedsJsProps> = ({ fallback, children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <noscript>{fallback}</noscript>
      {mounted ? children : null}
    </>
  )
}

export default NeedsJs
