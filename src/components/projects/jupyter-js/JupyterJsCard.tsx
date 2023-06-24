import type { ProjectFrontMatter } from '~/types/project'
import NextLink from 'next/link'
import Image from 'next/image'
import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import { COMMON_CLASSNAMES } from '../utils'
import bgImg from './jupyter-js-card.png'
import cx from '~/utils/cx'

interface JupyterJsCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded hocus:text-purple-500 hocus:bg-white focus-ring'

const JupyterJsCard: React.FC<JupyterJsCardProps> = ({ project }) => {
  return (
    <div className="sm:col-span-2">
      <div className={cx(COMMON_CLASSNAMES.specialCardRoot, 'bg-purple-600')}>
        <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
          <div>
            <Image
              src={bgImg}
              height="392"
              width="546"
              className="h-auto w-full"
              alt="preview showing jupyter-js' code and markdown cells running"
              placeholder="blur"
            />
          </div>
        </div>
        <div className="absolute inset-0 hidden bg-gradient-to-r from-purple-600 via-purple-600 to-transparent sm:block" />
        <div className="relative z-10 flex h-full flex-col space-y-4 p-8">
          <header className="font-display text-3xl font-bold">jupyter.js</header>
          <div className="max-w-[25rem] flex-1">
            <ul className="list-disc space-y-4 pl-6">
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
          <div className="-m-4 mb-0">
            {project.hasContent && (
              <NextLink href={`/projects/${project.slug}`} passHref>
                <a className={cardLinkClassName}>
                  <InfoIcon className="inline-block h-4 w-4" />
                  <span>Details</span>
                  <span className="sr-only"> for {project.title}</span>
                </a>
              </NextLink>
            )}
            <a
              className={cardLinkClassName}
              target="_blank"
              rel="noopener noreferrer"
              href={project.live}
            >
              <ExternalIcon className="inline-block h-4 w-4" />
              <span>
                See <span className="sr-only">{project.title}</span> Live
              </span>
            </a>
            <a
              className={cardLinkClassName}
              target="_blank"
              rel="noopener noreferrer"
              href={project.source}
            >
              <CodeIcon className="inline-block h-4 w-4" />
              <span>Source</span>
              <span className="sr-only"> for {project.title}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JupyterJsCard
