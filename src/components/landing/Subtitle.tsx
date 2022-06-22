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
  const Component = components[index]!

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
        aria-label="refresh subtitle about me"
        title="refresh subtitle about me"
      >
        <RefreshIcon
          className={cx('h-em w-em translate-y-1 transform transition-transform ease-in-out')}
          style={{
            ['--tw-rotate' as string]: `-${rotations}turn`,
            transitionDuration: `${rotationDuration}ms`,
          }}
        />
      </button>
    </div>
  )
}

export default Subtitle
