import NextLink from 'next/link'
import { ExternalIcon, InfoIcon } from '@/components/icons'
import { useReducer } from 'react'
import { ProjectCardComponent } from '../ProjectCard'

const ClinicallyRelevantLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="252"
    height="252"
    viewBox="0 0 252 252"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
  'px-3 py-1 ml-2 mt-2 inline-flex space-x-1 text-sm items-center border-2 transition border-current rounded-sm font-semibold ' +
  (theme === 'light'
    ? 'hover:bg-gray-800 hover:text-gray-100 hover:border-gray-800'
    : 'hover:bg-gray-100 hover:text-gray-800 hover:border-gray-100')

const ClinicallyRelevantCard: ProjectCardComponent = ({ project }) => {
  const [theme, toggle] = useReducer((t: Theme) => (t === 'light' ? 'dark' : 'light'), 'light')

  return (
    <article
      className={`relative overflow-hidden transition transform md:hover:scale-105 rounded-xl hover:shadow-xl ${themeClasses[theme]}`}
    >
      <div className="flex flex-col h-full p-8 space-y-4">
        <header className="flex items-center text-3xl font-bold font-display">
          <ClinicallyRelevantLogo className="inline-block w-6 h-6 mr-2" />
          Clinically Relevant
        </header>
        <div className="flex-1">
          <ul className="pl-6 space-y-2 list-disc">
            <li>PWA to allow users to install the website &amp; access it offline.</li>
            <li>Automatically redeploys when MDX content is updated</li>
            <li>
              Light &amp; Dark mode{' '}
              <button className="focus:outline-none" onClick={toggle}>
                <span className="sr-only focus:not-sr-only">
                  Toggle Clinically Relevant dark mode
                </span>
                {theme === 'light' ? '☀' : '🌙'}
              </button>
            </li>
          </ul>
        </div>
        <div className="mb-0 -m-2">
          <NextLink href={`/projects/${project.slug}`} passHref>
            <a className={cardLinkClassName(theme)}>
              <InfoIcon className="inline-block w-4 h-4" />
              <span>Details</span>
            </a>
          </NextLink>
          <a
            className={cardLinkClassName(theme)}
            target="_blank"
            rel="noopener noreferrer"
            href={project.live}
          >
            <ExternalIcon className="inline-block w-4 h-4" />
            <span>See Live</span>
          </a>
        </div>
      </div>
    </article>
  )
}

export default ClinicallyRelevantCard
