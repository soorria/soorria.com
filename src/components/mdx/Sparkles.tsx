import {
  ComponentProps,
  createSignal,
  For,
  onCleanup,
  onMount,
  ParentComponent,
  Show,
  VoidComponent,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'

import cx from '~/utils/cx'
import { random, randomItem } from '~/utils/random'

import { IconComponent, ReactIcon, SolidJsIcon, TypescriptIcon } from '../icons'

type SparklesProps = {
  block?: boolean
  absolute?: boolean
}

/**
 * Heavily inspired / copied from https://www.joshwcomeau.com/react/animated-sparkles-in-react/
 */

const COLORS = ['cyan', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'].map(
  c => `var(--${c})`
)

const zIndexes = {
  back: 5,
  content: 10,
  front: 15,
}

const SparkleSvg: SparkleComponent = props => {
  return (
    <Show
      when={props.kind && exoticSparkleComponents[props.kind]}
      fallback={
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={props.style}
          class={sparkleClassname}
        >
          <path
            d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
            fill="currentColor"
          />
        </svg>
      }
      keyed
    >
      {component => <Dynamic component={component} style={props.style} />}
    </Show>
  )
}

const iconComponentToSparkleComponent = (Icon: IconComponent): SparkleComponent => {
  const sparkleComponent: SparkleComponent = props => (
    <Dynamic component={Icon} style={props.style} class={sparkleClassname} />
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
type SparkleComponent = VoidComponent<SparkleDetails & ComponentProps<'svg'>>

const sparkleClassname = 'animation-sparkle pointer-events-none absolute select-none'

const Sparkles: ParentComponent<SparklesProps> = props => {
  const [sparkles, setSparkles] = createSignal<SparkleDetails[]>([])

  let timeout: ReturnType<typeof setTimeout> | undefined
  onMount(() => {
    const randomInterval = (fn: () => void) => {
      timeout = setTimeout(fn, random(50, 500))
    }

    const loop = () => {
      const now = Date.now()

      if (document.visibilityState === 'visible') {
        setSparkles(sparkles => {
          const next = sparkles.filter(s => now - s.createdAt < 1000)
          next.push(generateSparkleDetails())
          return next
        })
      }

      randomInterval(loop)
    }

    randomInterval(loop)
  })
  onCleanup(() => {
    if (timeout) {
      clearInterval(timeout)
    }
  })

  return (
    <span
      class={cx(
        props.absolute ? 'absolute inset-0' : 'relative',
        props.block ? 'block' : 'inline-block'
      )}
    >
      <For each={sparkles()}>{s => <SparkleSvg {...s} role="presentation" />}</For>
      <span class="relative" style={{ 'z-index': zIndexes.content }}>
        {props.children}
      </span>
    </span>
  )
}

export default Sparkles
