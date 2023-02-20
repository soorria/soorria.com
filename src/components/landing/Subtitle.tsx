import { createSignal, Show, VoidComponent } from 'solid-js'

import { randomIndex } from '~/utils/random'

import { RefreshIcon } from '../icons'

interface SubtitleProps {
  options?: string[]
}

const getDurationMs = (n: number) => 700 + n * 200

const Subtitle: VoidComponent<SubtitleProps> = props => {
  const [rotations, setRotations] = createSignal(0)
  let rotationTimeoutRef: ReturnType<typeof setTimeout> | undefined
  const rotationDuration = () => (rotations() > 0 ? getDurationMs(rotations()) : 0)
  const [index, setIndex] = createSignal(0)

  const selectedOption = () => (
    // eslint-disable-next-line solid/no-innerhtml
    <p class="md inline" innerHTML={props.options?.[index()] ?? ''} />
  )

  const randomise = () => {
    const options = props.options || []
    if (options.length < 1) return

    let i = index()
    while (i === index()) {
      i = randomIndex(options)
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
    <div>
      {selectedOption}
      <Show when={props.options?.length && props.options.length > 1}>
        <button
          onClick={randomise}
          class="focus-ring group relative ml-2 inline-flex translate-y-1 items-center rounded text-drac-highlight transition hocus:text-drac-purple"
          aria-label="refresh subtitle about me"
          title="refresh subtitle about me"
        >
          <RefreshIcon
            class="h-em w-em transform transition-transform ease-out"
            style={{
              '--tw-rotate': `-${rotations()}turn`,
              'transition-duration': `${rotationDuration()}ms`,
            }}
            onTransitionEnd={() => setRotations(0)}
          />
        </button>
      </Show>
    </div>
  )
}

export default Subtitle
