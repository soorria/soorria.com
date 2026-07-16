'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type ShowWhenVisibleProps = {
  children: ReactNode
  className?: string
}

const ShowWhenVisible = (props: ShowWhenVisibleProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShow(true)
          obs.disconnect()
        }
      },
      {
        threshold: [0],
      }
    )

    obs.observe(ref.current)

    return () => {
      obs.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className={props.className}>
      {show && props.children}
    </div>
  )
}

export default ShowWhenVisible
