import NextLink from 'next/link'
import Image from 'next/image'
import { CodeIcon, ExternalIcon, InfoIcon } from '@/components/icons'
import { ProjectFrontMatter } from '@/types/project'
import { forwardRef, ReactNode } from 'react'

interface JupyterJsCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded hover:text-purple-500 hover:bg-white'

const JupyterJsCard: React.FC<JupyterJsCardProps> = ({ project }) => {
  return (
    <article className="relative -mx-4 overflow-hidden transition transform bg-purple-500 md:hover:scale-105 sm:col-span-2 rounded-xl hover:shadow-xl">
      <div className="absolute inset-y-0 right-0 items-center hidden sm:flex">
        <Image src="/assets/projects/jupyter-js/jupyter-js-card.png" height="392" width="546" />
      </div>
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-purple-500 via-purple-500 to-transparent" />
      <div className="relative z-10 flex flex-col h-full p-8 space-y-4">
        <header className="text-3xl font-bold font-display">jupyter.js</header>
        <div className="flex-1 max-w-[25rem] prose">
          <ul className="mb-0">
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
        <div className="mb-0 -m-4">
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
    </article>
  )
}

export default JupyterJsCard
