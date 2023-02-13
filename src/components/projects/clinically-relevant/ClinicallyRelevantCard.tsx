import type { ProjectCardComponent } from '../ProjectCard'
import { ExternalIcon, InfoIcon } from '~/components/icons'
import { useTrackFirstEvent } from '~/lib/analytics'
import { COMMON_CLASSNAMES } from '../utils'
import cx from '~/utils/cx'
import { createSignal, Show, VoidComponent } from 'solid-js'
import { A } from 'solid-start'

const ClinicallyRelevantLogo: VoidComponent<{ class?: string }> = props => (
  <svg
    width="252"
    height="252"
    viewBox="0 0 252 252"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
    {...props}
  >
    <circle cx="126" cy="126" r="110" stroke="currentColor" stroke-width="24" />
    <circle cx="126" cy="66" r="50" stroke="currentColor" stroke-width="24" />
    <line x1="126" y1="126" x2="126" y2="246" stroke="currentColor" stroke-width="24" />
  </svg>
)

const themeClasses = {
  light: 'text-gray-800 bg-gray-100',
  dark: 'bg-gray-800 text-gray-100',
}
type Theme = keyof typeof themeClasses

const cardLinkClassName = (theme: Theme) =>
  cx(
    'px-3 py-1 ml-2 mt-2 inline-flex space-x-1 text-sm items-center border-2 transition border-current rounded-sm font-semibold focus-ring',
    theme === 'light'
      ? 'hocus:bg-gray-800 hocus:text-gray-100 hocus:border-gray-800'
      : 'hocus:bg-gray-100 hocus:text-gray-800 hocus:border-gray-100'
  )

const ClinicallyRelevantCard: ProjectCardComponent = props => {
  const track = useTrackFirstEvent()
  const [theme, setTheme] = createSignal<Theme>('light')
  const toggle = () => {
    track('Easter Egg', { props: { which: 'ClinicallyRelevant dark mode' } })
    setTheme(theme() === 'light' ? 'dark' : 'light')
  }

  return (
    <div class={cx(themeClasses[theme()], COMMON_CLASSNAMES.specialCardRoot)}>
      <div class="flex h-full flex-col space-y-4 p-8">
        <header class="flex items-center font-display text-3xl font-bold">
          <ClinicallyRelevantLogo class="mr-2 inline-block h-6 w-6 shrink-0" />
          Clinically Relevant
        </header>
        <div class="flex-1">
          <ul class="list-disc space-y-2 pl-6">
            <li>PWA to allow users to install the website &amp; access it offline.</li>
            <li>Automatically redeploys when MDX content is updated</li>
            <li>
              Light &amp; Dark mode{' '}
              <button
                type="button"
                onClick={toggle}
                class="focus-ring rounded"
                aria-label="Toggle Clinically Relevant dark mode"
              >
                {theme() === 'light' ? '&#57113;' : '&#9728;'}
              </button>
            </li>
          </ul>
        </div>
        <div class="-m-2 mb-0">
          <Show when={props.project.hasContent}>
            <A href={`/projects/${props.project.slug}`}>
              <a class={cardLinkClassName(theme())}>
                <InfoIcon class="inline-block h-4 w-4" />
                <span>Details</span>
                <span class="sr-only"> for {props.project.title}</span>
              </a>
            </A>
          </Show>
          <a
            class={cardLinkClassName(theme())}
            target="_blank"
            rel="noopener noreferrer"
            href={props.project.live}
          >
            <ExternalIcon class="inline-block h-4 w-4" />
            <span>
              See <span class="sr-only">{props.project.title}</span> Live
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ClinicallyRelevantCard
