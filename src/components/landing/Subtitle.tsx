import { useMdxComponents } from '@/lib/mdx'
import cx from '@/utils/cx'
import { randomIndex } from '@/utils/random'
import { useRef, useState } from 'react'
import { RefreshIcon } from '../icons'

interface SubtitleProps {
  options?: string[] | null | undefined
}

const getDurationMs = (n: number) => 700 + n * 200

const Subtitle: React.FC<SubtitleProps> = ({ options }) => {
  const [rotations, setRotations] = useState(0)
  const rotationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>()
  const rotationDuration = rotations > 0 ? getDurationMs(rotations) : 0
  const [index, setIndex] = useState(0)
  const components = useMdxComponents(options)
  const Component = components[index]

  const randomise = () => {
    if (components.length < 1) return

    let i = index
    while (i === index) {
      i = randomIndex(components)
    }

    setIndex(i)

    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current)
    }
    rotationTimeoutRef.current = setTimeout(() => {
      setRotations(0)
    }, getDurationMs(rotations + 1) + 300)

    setRotations(r => r + 1)
  }

  return (
    <div className="subtitle-wrapper">
      <Component />
      <button
        onClick={randomise}
        className="group relative inline-flex items-center text-drac-comment transition-colors hocus:text-drac-purple"
      >
        <RefreshIcon
          className={cx('h-em w-em translate-y-1 transform transition-transform ease-in-out')}
          style={{
            ['--tw-rotate' as string]: `-${rotations}turn`,
            transitionDuration: `${rotationDuration}ms`,
          }}
        />
        <span
          className={cx(
            'pointer-events-none absolute -top-full left-1/2 w-auto -translate-x-1/2',
            'whitespace-pre rounded bg-drac-bg px-2 py-1 text-sm text-drac-fg',
            'opacity-0 transition-opacity group-hover:opacity-100 group-hover:delay-150'
          )}
        >
          refresh subtitle about me
        </span>
      </button>
    </div>
  )
}

export default Subtitle
