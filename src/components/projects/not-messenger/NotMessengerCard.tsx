import { Show } from 'solid-js'
import { A } from 'solid-start'

import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import cx from '~/utils/cx'

import type { ProjectCardComponent } from '../ProjectCard'
import { COMMON_CLASSNAMES } from '../utils'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-sm hocus:text-green-700 hocus:bg-white focus-ring'

const NotMessengerCard: ProjectCardComponent = props => {
  return (
    <div class={cx('bg-gray-700', COMMON_CLASSNAMES.specialCardRoot)}>
      <div class="flex h-full flex-col space-y-4 p-8">
        <header class="flex items-center font-display text-3xl font-bold text-green-400">
          Not Messenger
        </header>
        <div class="flex-1">
          <ul class="list-disc space-y-2 pl-6">
            <li>Realtime chat application with socket.io, Express.js and MongoDB</li>
            <li>Strangely similar to Facebook Messenger</li>
          </ul>
        </div>
        <div class="-m-2 mb-0">
          <Show when={props.project.hasContent}>
            <A href={`/projects/${props.project.slug}`}>
              {' '}
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

export default NotMessengerCard
