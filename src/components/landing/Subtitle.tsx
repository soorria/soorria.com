import { useMdxComponents } from '@/lib/mdx'
import cx from '@/utils/cx'
import { randomIndex } from '@/utils/random'
import { useRef, useState } from 'react'
import { RefreshIcon } from '../icons'

interface SubtitleProps {
  options?: string[] | null | undefined
}

const Subtitle: React.FC<SubtitleProps> = ({ options }) => {
  const [rotations, setRotations] = useState(0)
  const rotationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>()
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

    setRotations(r => r + 1)
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current)
    }
    rotationTimeoutRef.current = setTimeout(() => {
      setRotations(0)
    }, 1000)
  }

  return (
    <div className="subtitle-wrapper">
      <Component />
      <button
        onClick={randomise}
        className="ml-2 inline-flex items-center text-drac-comment transition-colors hocus:text-drac-purple"
      >
        <RefreshIcon
          className={cx(
            'h-em w-em translate-y-1 transform transition-transform',
            rotations > 0 ? 'duration-700' : 'duration-[0s]'
          )}
          style={{ '--tw-rotate': `-${rotations}turn` } as any}
        />
      </button>
    </div>
  )
}

export default Subtitle
