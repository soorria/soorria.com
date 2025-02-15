import { cx } from '~/lib/utils/styles'
import { randomIndex } from '~/lib/utils/random'
import { useRef, useState } from 'react'
import { RefreshIcon } from '../icons'

interface SubtitleProps {
  options?: string[] | undefined
}

const getDurationMs = (n: number) => 700 + n * 200

const Subtitle: React.FC<SubtitleProps> = ({ options = [], ...args }) => {
  const [rotations, setRotations] = useState(0)
  const rotationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rotationDuration = rotations > 0 ? getDurationMs(rotations) : 0
  const [index, setIndex] = useState(0)
  const previousIndexes = useRef<number[]>([])

  const randomise = () => {
    if (options.length < 1) return

    let i = index
    previousIndexes.current = [i, ...previousIndexes.current].slice(0, 5)
    while (previousIndexes.current.includes(i)) {
      i = randomIndex(options)
    }

    setIndex(i)

    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current)
    }
    rotationTimeoutRef.current = setTimeout(
      () => {
        setRotations(0)
      },
      getDurationMs(rotations + 1) + 300,
    )

    setRotations((r) => r + 1)
  }

  return (
    <div className="[&>p]:inline [&>p]:text-pretty">
      {options[index] && <p dangerouslySetInnerHTML={{ __html: options[index] }}></p>}

      <button
        onClick={randomise}
        className="focus-ring group text-drac-highlight hocus:text-drac-purple relative ml-2 inline-flex translate-y-1 items-center rounded-sm transition"
        aria-label="refresh subtitle about me"
        title="refresh subtitle about me"
      >
        <RefreshIcon
          className={cx('h-em w-em scale-x-100 transform transition-transform ease-out')}
          style={{
            rotate: `-${rotations}turn`,
            transitionDuration: `${rotationDuration}ms`,
          }}
        />
      </button>
    </div>
  )
}

export default Subtitle
