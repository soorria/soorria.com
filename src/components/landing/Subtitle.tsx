import { useMdxComponents } from '@/lib/mdx'
import { randomItem } from '@/utils/random'
import { useState } from 'react'
import { RefreshIcon } from '../icons'

interface SubtitleProps {
  options?: string[] | null | undefined
}

const Subtitle: React.FC<SubtitleProps> = ({ options }) => {
  const [index, setIndex] = useState(0)
  const components = useMdxComponents(options)
  const Component = components[index]

  const randomise = () => {
    if (components.length < 1) return

    let c = Component
    while (c === Component) {
      c = randomItem(components)
    }

    setIndex(components.indexOf(c))
  }

  return (
    <div className="children-p-inline">
      <Component />
      <button
        onClick={randomise}
        className="ml-2 inline-flex items-center text-drac-comment transition-colors hocus:text-drac-purple"
      >
        <RefreshIcon className="h-em w-em translate-y-1" />
      </button>
    </div>
  )
}

export default Subtitle
