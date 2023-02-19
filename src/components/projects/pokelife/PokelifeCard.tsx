import {
  Component,
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  ParentComponent,
  Show,
} from 'solid-js'
import { A } from 'solid-start'

import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import type { ProjectFrontMatter } from '~/types/project'
import cx from '~/utils/cx'

import { COMMON_CLASSNAMES } from '../utils'

interface PokelifeCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded hocus:text-drac-base hocus:bg-white focus-ring'

const SettingButton: ParentComponent<ComponentProps<'button'>> = props => {
  return (
    <button
      {...props}
      class="focus-ring -mx-1 cursor-pointer break-words break-all rounded px-1 underline disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}

const typesOptions = [['fire', 'water', 'grass'], ['ground', 'grass', 'poison'], []]

const PokelifeCard: Component<PokelifeCardProps> = props => {
  const [delay, setDelay] = createSignal(100)
  const [destroyCpu, setDestroyCpu] = createSignal(false)
  const [types, setTypes] = createSignal(0)
  const [showDemo, setShowDemo] = createSignal(false)
  let root: HTMLDivElement | undefined

  const url = createMemo(() => {
    type PokelifeOptions = {
      embed?: 'true'
      size?: string
      delay?: string
      types?: string
    }

    const params = { embed: 'true' } as PokelifeOptions
    if (destroyCpu()) {
      params.size = '1'
    } else {
      params.delay = delay.toString()
      params.types = typesOptions[types()]?.join(',') ?? ''
    }
    return `https://pokelife.soorria.com/?${new URLSearchParams(params)}`
  })

  createEffect(() => {
    if (!root) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShowDemo(true)
          obs.disconnect()
        }
      },
      {
        threshold: [0],
      }
    )

    obs.observe(root)

    onCleanup(() => {
      obs.disconnect()
    })
  })

  const isDataSaver =
    typeof window !== 'undefined' &&
    (navigator as unknown as { connection: { saveData: boolean } })?.connection?.saveData

  return (
    <div
      id="pokelife"
      ref={root}
      class={cx('bg-[#272933] sm:col-span-2', COMMON_CLASSNAMES.specialCardRoot)}
    >
      <div class="absolute -inset-4 grid grid-cols-3 overflow-hidden rounded-xl">
        <Show when={!isDataSaver && showDemo}>
          <iframe
            title="Pokelife"
            tabIndex={-1}
            src={url()}
            class="no-js-hidden col-span-2 col-start-2 ml-auto block h-full w-full rounded-xl"
          />
        </Show>
        <noscript class="col-span-2 col-start-2 grid items-center justify-end p-12">
          <p class="hidden w-48 text-right text-xl sm:block">
            Enable JavaScript to see a demo here!
          </p>
        </noscript>
      </div>
      <div class="absolute -inset-4 bg-gradient-to-r from-[#272933] via-[#272933] to-[#27293377] sm:to-transparent" />
      <div class="relative z-10 flex h-full flex-col space-y-4 rounded-xl p-8 ring-4 ring-inset ring-drac-pink">
        <header class="font-display text-3xl font-bold">Pokelife</header>
        <div class="max-w-[25rem] flex-1">
          <ul class="list-disc space-y-4 pl-6">
            <li>
              Like Conway&apos;s Game of Life but with Pokemon types instead of boring 1s and 0s.
            </li>
            <li>
              Configurable settings for a{' '}
              <SettingButton
                disabled={delay() === 0}
                onClick={() => setDelay(Math.max(delay() - 50, 0))}
              >
                faster
              </SettingButton>{' '}
              or{' '}
              <SettingButton
                disabled={delay() === 5000}
                onClick={() => setDelay(Math.min(delay() + 50, 5000))}
              >
                slower
              </SettingButton>{' '}
              vizualisation, to{' '}
              <SettingButton onClick={() => setDestroyCpu(p => !p)}>
                {destroyCpu() ? 'protect' : 'destroy'} your cpu
              </SettingButton>{' '}
              or{' '}
              <SettingButton onClick={() => setTypes((types() + 1) % typesOptions.length)}>
                remove types you don&apos;t like
              </SettingButton>
              . <small>(click underlined words!)</small>
            </li>
            <li class="no-js-hidden">Embeddable, and mesmerising to look at →.</li>
            <li>
              Runs off the main thread so you get a buttery smooth<sup>ish</sup> UI even on the most
              taxing settings
            </li>
          </ul>
        </div>
        <div class="-m-4 mb-0">
          <Show when={props.project.hasContent}>
            <A href={`/projects/${props.project.slug}`}>
              <a class={cardLinkClassName}>
                <InfoIcon class="inline-block h-4 w-4" />
                <span>Details</span>
                <span class="sr-only"> for {props.project.title}</span>
              </a>
            </A>
          </Show>
          <a
            class={cardLinkClassName}
            target="_blank"
            rel="noopener noreferrer"
            href={props.project.live}
          >
            <ExternalIcon class="inline-block h-4 w-4" />
            <span>
              See <span class="sr-only">{props.project.title}</span> Live
            </span>
          </a>
          <a
            class={cardLinkClassName}
            target="_blank"
            rel="noopener noreferrer"
            href={props.project.source}
          >
            <CodeIcon class="inline-block h-4 w-4" />
            <span>Source</span>
            <span class="sr-only"> for {props.project.title}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default PokelifeCard
