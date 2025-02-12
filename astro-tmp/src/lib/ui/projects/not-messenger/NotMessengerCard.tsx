import type { ProjectCardComponent } from '../ProjectCard'
import { CodeIcon, ExternalIcon, InfoIcon } from '~/lib/ui/icons'
import { COMMON_CLASSNAMES } from '../utils'
import { cx } from '~/lib/utils/styles'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-xs hocus:text-green-700 hocus:bg-white focus-ring'

const NotMessengerCard: ProjectCardComponent = ({ project }) => {
  return (
    <div id={project.id}>
      <div className={cx('bg-gray-700', COMMON_CLASSNAMES.specialCardRoot)}>
        <div className="flex h-full flex-col space-y-4 p-8">
          <header className="font-display flex items-center text-3xl font-bold text-green-400">
            Not Messenger
          </header>
          <div className="flex-1">
            <ul className="list-disc space-y-2 pl-6">
              <li>Realtime chat application with socket.io, Express.js and MongoDB</li>
              <li>Strangely similar to Facebook Messenger</li>
            </ul>
          </div>
          <div className="-m-2 mb-0">
            {project.data.hasContent && (
              <a href={`/projects/${project.id}`} className={cardLinkClassName}>
                <InfoIcon className="inline-block h-4 w-4" />
                <span>Details</span>
                <span className="sr-only"> for {project.data.title}</span>
              </a>
            )}
            <a
              className={cardLinkClassName}
              target="_blank"
              rel="noopener noreferrer"
              href={project.data.live}
            >
              <ExternalIcon className="inline-block h-4 w-4" />
              <span>
                See <span className="sr-only">{project.data.title}</span> Live
              </span>
            </a>
            <a
              className={cardLinkClassName}
              target="_blank"
              rel="noopener noreferrer"
              href={project.data.source}
            >
              <CodeIcon className="inline-block h-4 w-4" />
              <span>Source</span>
              <span className="sr-only"> for {project.data.title}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotMessengerCard
