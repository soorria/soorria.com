import { cx } from '~/lib/utils/styles'
import type { ProjectCardProps } from '../ProjectCard'
import { COMMON_CLASSNAMES } from '../utils'
import UtilsTag from './UtilsTag'
import { CodeIcon, ExternalIcon, InfoIcon } from '~/lib/ui/icons'
import { type PropsWithChildren } from 'react'
import type { ImageMetadata } from 'astro'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-xs hocus:text-var-bg hocus:bg-white focus-ring'

type UtilsProjectCardProps = PropsWithChildren<
  ProjectCardProps &
    (
      | { fullWidth: true; bgImage?: ImageMetadata; bgAlt: string }
      | { fullWidth?: false; bgImage: never; bgAlt: never }
    )
>

const UtilsProjectCard: React.FC<UtilsProjectCardProps> = ({
  project,
  bgImage,
  children,
  fullWidth,
}) => {
  return (
    <div className={fullWidth ? 'col-span-full' : ''} id={project.id}>
      <div
        className={cx(COMMON_CLASSNAMES.specialCardRoot, 'bg-var-bg')}
        style={{ ['--bg' as any]: '#414558', ['--col' as any]: '#FF7AC6' }}
      >
        {fullWidth && bgImage ? (
          <>
            <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
              <div>
                <img
                  src={bgImage.src}
                  height="356"
                  width="381"
                  alt="flowchart showing file sizes after gzip"
                  // placeholder="blur"
                />
              </div>
            </div>
            <div className="from-var-bg via-var-bg absolute inset-0 bg-linear-to-r to-transparent"></div>
          </>
        ) : null}
        <div className="relative flex h-full flex-col space-y-4 p-8">
          <header className="font-display text-var-col flex items-center space-x-2 text-3xl font-bold">
            <span>{project.data.title}</span> <UtilsTag />
          </header>
          <div className="flex max-w-[25rem]">
            <ul className="list-disc space-y-4 pl-6">{children}</ul>
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

export default UtilsProjectCard
