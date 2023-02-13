import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import cx from '~/utils/cx'
import { COMMON_CLASSNAMES } from '../utils'
import bgImg from './jupyter-js-card.png'
import { ProjectCardComponent } from '../ProjectCard'
import { A } from 'solid-start'
import { Show } from 'solid-js'

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded hocus:text-purple-500 hocus:bg-white focus-ring'

const JupyterJsCard: ProjectCardComponent = props => {
  return (
    <div class={cx('bg-purple-600 sm:col-span-2', COMMON_CLASSNAMES.specialCardRoot)}>
      <div class="absolute inset-y-0 right-0 hidden items-center sm:flex">
        <div>
          <img
            src={bgImg}
            height="392"
            width="546"
            class="h-auto w-full"
            alt="preview showing jupyter-js' code and markdown cells running"
            // placeholder="blur"
          />
        </div>
      </div>
      <div class="absolute inset-0 hidden bg-gradient-to-r from-purple-600 via-purple-600 to-transparent sm:block" />
      <div class="relative z-10 flex h-full flex-col space-y-4 p-8">
        <header class="font-display text-3xl font-bold">jupyter.js</header>
        <div class="max-w-[25rem] flex-1">
          <ul class="list-disc space-y-4 pl-6">
            <li>
              A SaaS notebook app for frontend JavaScript inspired by python&apos;s jupyter
              notebooks.
            </li>
            <li>
              Use any client-side NPM package or CSS library with an ESM <code>import</code>
            </li>
            <li>Lightning fast bundling &amp; JSX transpilation out of the box with esbuild.</li>
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

export default JupyterJsCard
