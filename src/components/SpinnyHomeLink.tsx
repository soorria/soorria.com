import { random } from '~/utils/random'
import Logo from './logo'
import cx from '~/utils/cx'
import { createEffect, createSignal, VoidComponent } from 'solid-js'
import { A, useIsRouting } from 'solid-start'

const MIN_ROTATION = 0
const MAX_ROTATION = 360 * 4
const START_ROTATION = MAX_ROTATION / 2

const RESET_TIMEOUT = 10000 // 10 seconds

const SpinnyHomeLink: VoidComponent<{ href?: string }> = ({ href = '/' }) => {
  const [rotation, setRotation] = createSignal(START_ROTATION)
  let resetTimout: ReturnType<typeof setTimeout> | undefined
  const isRouting = useIsRouting()

  createEffect(() => {
    const value = isRouting()
    if (!value) {
      setRotation(random(MIN_ROTATION, MAX_ROTATION))
      if (resetTimout) {
        clearTimeout(resetTimout)
      }
      resetTimout = setTimeout(() => {
        setRotation(START_ROTATION)
      }, RESET_TIMEOUT)
    }
  })

  return (
    <A href={href} class="focus-ring group z-10 -m-2 flex items-center rounded p-2">
      <span
        class="h-8 w-8 transform transition-transform duration-700 ease-in-out md:h-10 md:w-10"
        style={{ '--tw-rotate': `${rotation()}deg` }}
      >
        <Logo />
      </span>
      <span
        class={cx('spinny-home-link font-display text-2xl font-bold lowercase sm:ml-4 sm:text-3xl')}
      >
        <span class="sr-only sm:not-sr-only">Soorria</span>
        {/* <span class="sr-only lg:not-sr-only">moorthy</span> */}
        <span class="sr-only md:not-sr-only"> Saruva</span>
      </span>
    </A>
  )
}

export default SpinnyHomeLink
