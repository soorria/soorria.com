import { Accessor, createEffect, onCleanup } from 'solid-js'

export const useScrollCssVar = (name: Accessor<string>): void => {
  createEffect(() => {
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
      document.body.style.setProperty(name(), percent)
      raf = requestAnimationFrame(loop)
    }

    handleScroll()
    loop()

    window.addEventListener('scroll', handleScroll, { passive: true })

    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll)
      if (raf) cancelAnimationFrame(raf)
    })
  })
}
