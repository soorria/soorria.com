import { CodeIcon, ExternalIcon, InfoIcon } from '@/components/icons'
import NextLink from 'next/link'
import { ProjectCardComponent } from '../ProjectCard'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-sm hover:text-green-700 hover:bg-white'

const NotMessengerCard: ProjectCardComponent = ({ project }) => {
  return (
    <div className="relative overflow-hidden transition transform bg-gray-700 md:hover:scale-105 rounded-xl hover:shadow-xl">
      <div className="flex flex-col h-full p-8 space-y-4">
        <header className="flex items-center text-3xl font-bold text-green-400 font-display">
          Not Messenger
        </header>
        <div className="flex-1">
          <ul className="pl-6 space-y-2 list-disc">
            <li>Realtime chat application with socket.io, Express.js and MongoDB</li>
            <li>Strangely similar to Facebook Messenger</li>
          </ul>
        </div>
        <div className="mb-0 -m-2">
          <NextLink href={`/projects/${project.slug}`} passHref>
            <a className={cardLinkClassName}>
              <InfoIcon className="inline-block w-4 h-4" />
              <span>Details</span>
            </a>
          </NextLink>
          <a
            className={cardLinkClassName}
            target="_blank"
            rel="noopener noreferrer"
            href={project.live}
          >
            <ExternalIcon className="inline-block w-4 h-4" />
            <span>See Live</span>
          </a>
          <a
            className={cardLinkClassName}
            target="_blank"
            rel="noopener noreferrer"
            href={project.source}
          >
            <CodeIcon className="inline-block w-4 h-4" />
            <span>Source</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default NotMessengerCard
