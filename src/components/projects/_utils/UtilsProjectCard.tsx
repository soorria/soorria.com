import cx from '@/utils/cx'
import NextLink from 'next/link'
import Image, { ImageProps } from 'next/future/image'
import type { ProjectCardProps } from '../ProjectCard'
import { COMMON_CLASSNAMES } from '../utils'
import UtilsTag from './UtilsTag'
import { CodeIcon, ExternalIcon, InfoIcon } from '@/components/icons'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-sm hocus:text-var-bg hocus:bg-white focus-ring'

type UtilsProjectCardProps = ProjectCardProps &
  (
    | {
        fullWidth: true
        bgImage?: ImageProps['src']
        bgAlt: string
      }
    | {
        fullWidth?: false
        bgImage: never
        bgAlt: never
      }
  )

const UtilsProjectCard: React.FC<UtilsProjectCardProps> = ({
  project,
  bgImage,
  children,
  fullWidth,
}) => {
  return (
    <div
      className={cx(COMMON_CLASSNAMES.specialCardRoot, 'bg-var-bg', fullWidth && 'col-span-full')}
      style={{ ['--bg' as any]: '#414558', ['--col' as any]: '#FF7AC6' }}
    >
      {fullWidth && bgImage ? (
        <>
          <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
            <div>
              <Image
                src={bgImage}
                height="356"
                width="381"
                alt="flowchart showing file sizes after gzip"
                placeholder="blur"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-var-bg via-var-bg to-transparent"></div>
        </>
      ) : null}
      <div className="relative flex h-full flex-col space-y-4 p-8">
        <header className="flex items-center space-x-2 font-display text-3xl font-bold text-var-col">
          <span>{project.title}</span> <UtilsTag />
        </header>
        <div className="flex max-w-[25rem]">
          <ul className="list-disc space-y-4 pl-6">{children}</ul>
        </div>
        <div className="-m-2 mb-0">
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
  )
}

export default UtilsProjectCard
