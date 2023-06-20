import { useEffect } from 'react'

export type ScrollVar = `--${string}`
export const useScrollCssVar = (name: ScrollVar): void => {
  useEffect(() => {
    let percent = '0'
    let raf: number

    const handleScroll = () => {
      const body = document.body
      const html = document.documentElement
      percent = (
        (body.scrollTop || html.scrollTop) /
        (html.scrollHeight - html.clientHeight)
      ).toFixed(2)
    }

    const loop = () => {
      document.body.style.setProperty(name, percent)
      raf = requestAnimationFrame(loop)
    }

    handleScroll()
    loop()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [name])
}
