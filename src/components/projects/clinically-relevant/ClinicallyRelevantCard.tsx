'use client'

import type { ProjectCardComponent } from '../ProjectCard'
import NextLink from 'next/link'
import { ExternalIcon, InfoIcon } from '~/components/icons'
import { useReducer } from 'react'
import { useTrackFirstEvent } from '~/lib/analytics'
import { COMMON_CLASSNAMES } from '../utils'
import cx from '~/utils/cx'

const ClinicallyRelevantLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="252"
    height="252"
    viewBox="0 0 252 252"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="presentation"
  >
    <circle cx="126" cy="126" r="110" stroke="currentColor" strokeWidth="24" />
    <circle cx="126" cy="66" r="50" stroke="currentColor" strokeWidth="24" />
    <line x1="126" y1="126" x2="126" y2="246" stroke="currentColor" strokeWidth="24" />
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

const ClinicallyRelevantCard: ProjectCardComponent = ({ project }) => {
  const track = useTrackFirstEvent()
  const [theme, toggle] = useReducer(
    (t: Theme) => (
      track('Easter Egg', { props: { which: 'ClinicallyRelevant dark mode' } }),
      t === 'light' ? 'dark' : 'light'
    ),
    'light'
  )

  return (
    <div id={project.slug}>
      <div className={cx(COMMON_CLASSNAMES.specialCardRoot, themeClasses[theme])}>
        <div className="flex h-full flex-col space-y-4 p-8">
          <header className="flex items-center font-display text-3xl font-bold">
            <ClinicallyRelevantLogo className="mr-2 inline-block h-6 w-6" />
            Clinically Relevant
          </header>
          <div className="flex-1">
            <ul className="list-disc space-y-2 pl-6">
              <li>PWA to allow users to install the website &amp; access it offline.</li>
              <li>Automatically redeploys when MDX content is updated</li>
              <li>
                Light &amp; Dark mode{' '}
                <button
                  type="button"
                  onClick={toggle}
                  className="focus-ring rounded"
                  aria-label="Toggle Clinically Relevant dark mode"
                >
                  {theme === 'light' ? '🌙' : '☀'}
                </button>
              </li>
            </ul>
          </div>
          <div className="-m-2 mb-0">
            {project.hasContent && (
              <NextLink href={`/projects/${project.slug}`} passHref>
                <a className={cardLinkClassName(theme)}>
                  <InfoIcon className="inline-block h-4 w-4" />
                  <span>Details</span>
                  <span className="sr-only"> for {project.title}</span>
                </a>
              </NextLink>
            )}
            <a
              className={cardLinkClassName(theme)}
              target="_blank"
              rel="noopener noreferrer"
              href={project.live}
            >
              <ExternalIcon className="inline-block h-4 w-4" />
              <span>
                See <span className="sr-only">{project.title}</span> Live
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClinicallyRelevantCard
