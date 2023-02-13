import { RefreshIcon } from '../icons'
import { createMemo, createSignal, VoidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { randomIndex } from '~/utils/random'

interface SubtitleProps {
  options?: string[]
}

const getDurationMs = (n: number) => 700 + n * 200

const Subtitle: VoidComponent<SubtitleProps> = props => {
  const [rotations, setRotations] = createSignal(0)
  let rotationTimeoutRef: ReturnType<typeof setTimeout> | undefined
  const rotationDuration = () => (rotations() > 0 ? getDurationMs(rotations()) : 0)
  const [index, setIndex] = createSignal(0)
  const components = createMemo(() => props.options?.map(o => () => <p>{o}</p>) ?? [])
  const getComponent = () => components()[index()]!

  const randomise = () => {
    if (components().length < 1) return

    let i = index()
    while (i === index()) {
      i = randomIndex(components())
    }

    setIndex(i)

    if (rotationTimeoutRef) {
      clearTimeout(rotationTimeoutRef)
    }
    rotationTimeoutRef = setTimeout(() => {
      setRotations(0)
    }, getDurationMs(rotations() + 1) + 300)

    setRotations(r => r + 1)
  }

  return (
    <div class="[&>p]:inline">
      <Dynamic component={getComponent()} />
      <button
        onClick={randomise}
        class="focus-ring group relative ml-2 inline-flex translate-y-1 items-center rounded text-drac-highlight transition hocus:text-drac-purple"
        aria-label="refresh subtitle about me"
        title="refresh subtitle about me"
      >
        <RefreshIcon
          class="h-em w-em transform transition-transform ease-out"
          style={{
            ['--tw-rotate' as string]: `-${rotations()}turn`,
            'transition-duration': `${rotationDuration()}ms`,
          }}
        />
      </button>
    </div>
  )
}

export default Subtitle
