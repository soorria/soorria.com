import { ComponentProps, ParentComponent, Show } from 'solid-js'
import { A } from 'solid-start'

import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import cx from '~/utils/cx'

import type { ProjectCardProps } from '../ProjectCard'
import { COMMON_CLASSNAMES } from '../utils'
import UtilsTag from './UtilsTag'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-sm hocus:text-var-bg hocus:bg-white focus-ring'

type UtilsProjectCardProps = ProjectCardProps &
  (
    | { fullWidth: true; bgImage?: ComponentProps<'img'>['src']; bgAlt: string }
    | { fullWidth?: false; bgImage: never; bgAlt: never }
  )

const UtilsProjectCard: ParentComponent<UtilsProjectCardProps> = props => {
  return (
    <div
      class={cx(COMMON_CLASSNAMES.specialCardRoot, 'bg-var-bg', props.fullWidth && 'col-span-full')}
      style={{ ['--bg' as any]: '#414558', ['--col' as any]: '#FF7AC6' }}
    >
      <Show when={props.fullWidth && props.bgImage}>
        <>
          <div class="absolute inset-y-0 right-0 hidden items-center sm:flex">
            <div>
              <img
                src={props.bgImage}
                height="356"
                width="381"
                alt="flowchart showing file sizes after gzip"
                // placeholder="blur"
              />
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-var-bg via-var-bg to-transparent" />
        </>
      </Show>
      <div class="relative flex h-full flex-col space-y-4 p-8">
        <header class="flex items-center space-x-2 font-display text-3xl font-bold text-var-col">
          <span>{props.project.title}</span> <UtilsTag />
        </header>
        <div class="flex max-w-[25rem]">
          <ul class="list-disc space-y-4 pl-6">{props.children}</ul>
        </div>
        <div class="-m-2 mb-0">
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

export default UtilsProjectCard
