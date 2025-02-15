import { type IconComponent, ReactIcon, SolidJsIcon, TypescriptIcon } from '~/lib/ui/icons'
import { random, randomItem } from '~/lib/utils/random'
import { type PropsWithChildren, useEffect, useState } from 'react'
import { cx } from '../utils/styles'

type SparklesProps = PropsWithChildren<{
  block?: boolean
}>

/**
 * Heavily inspired / copied from https://www.joshwcomeau.com/react/animated-sparkles-in-react/
 */

const COLORS = ['cyan', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'].map(
  (c) => `var(--${c})`,
)

const zIndexes = {
  back: 5,
  content: 10,
  front: 15,
}

const SparkleSvg: SparkleComponent = (props) => {
  const { style, kind } = props
  if (kind && exoticSparkleComponents[kind]) {
    const Sparkle = exoticSparkleComponents[kind]!
    return <Sparkle {...props} />
  }
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={sparkleClassname}
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

const iconComponentToSparkleComponent = (Icon: IconComponent): SparkleComponent => {
  const sparkleComponent: SparkleComponent = ({ style }) => (
    <Icon style={style} className={sparkleClassname} />
  )
  return sparkleComponent
}

const exoticSparkleComponents: Record<string, SparkleComponent> = {
  react: iconComponentToSparkleComponent(ReactIcon),
  ts: iconComponentToSparkleComponent(TypescriptIcon),
  solid: iconComponentToSparkleComponent(SolidJsIcon),
}
const exoticKinds: string[] = Object.keys(exoticSparkleComponents)

const generateSparkleDetails = () => {
  const sizeNum = random(40, 100) / 100
  const size = `${sizeNum}em`
  const front = Math.random() > 0.3
  const position = () => `calc(${random(0, 100) + '%'} - ${sizeNum / 2}em)`
  return {
    createdAt: Date.now(),
    style: {
      color: randomItem(COLORS),
      top: position(),
      left: position(),
      tranform: 'translate(-50%, -50%)',
      width: size,
      height: size,
      zIndex: front ? zIndexes.front : zIndexes.back,
    },
    kind: Math.random() > 0.9 ? randomItem(exoticKinds) : null,
  }
}

type SparkleDetails = ReturnType<typeof generateSparkleDetails>
type SparkleComponent = React.FC<SparkleDetails>

const sparkleClassname = 'animation-sparkle pointer-events-none absolute'

const Sparkles: React.FC<SparklesProps> = ({ children, block }) => {
  const [sparkles, setSparkles] = useState<SparkleDetails[]>([])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null
    const randomInterval = (fn: () => void) => {
      timeout = setTimeout(fn, random(50, 500))
    }

    const loop = () => {
      const now = Date.now()

      if (document.visibilityState === 'visible') {
        setSparkles((sparkles) => {
          const next = sparkles.filter((s) => now - s.createdAt < 1000)
          next.push(generateSparkleDetails())
          return next
        })
      }

      randomInterval(loop)
    }

    randomInterval(loop)

    return () => {
      if (timeout) {
        clearInterval(timeout)
      }
    }
  }, [])

  return (
    <span className={cx('relative', block ? 'block' : 'inline-block')}>
      {sparkles.map((s) => (
        <SparkleSvg key={s.createdAt} {...s} />
      ))}
      <span className="relative" style={{ zIndex: zIndexes.content }}>
        {children}
      </span>
    </span>
  )
}

export default Sparkles
