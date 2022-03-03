import { useEffect, useState } from 'react'

interface NeedsJsProps {
  fallback: React.ReactNode
}

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
