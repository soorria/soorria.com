import NextLink from 'next/link'
import Image from 'next/image'

import { CodeIcon, ExternalIcon, InfoIcon } from '@/components/icons'

import type { ProjectCardComponent } from '../ProjectCard'
import { COMMON_CLASSNAMES } from '../utils'
import cx from '@/utils/cx'
import bgImg from './sizes.png'

const cardLinkClassName =
  'inline-flex items-center px-3 py-1 ml-2 mt-2 space-x-1 text-sm font-semibold transition-colors border-2 border-current border-white rounded-sm hocus:text-var-bg hocus:bg-white'

const SizesCard: ProjectCardComponent = ({ project }) => {
  return (
    <div
      className={cx(COMMON_CLASSNAMES.specialCardRoot, 'col-span-full bg-var-bg')}
      style={{ ['--bg' as any]: '#414558', ['--col' as any]: '#FF7AC6' }}
    >
      <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
        <Image
          src={bgImg}
          height="356"
          width="381"
          alt="flowchart showing file sizes after gzip"
          placeholder="blur"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-var-bg via-var-bg to-transparent"></div>
      <div className="relative flex h-full flex-col space-y-4 p-8">
        <header className="flex items-center font-display text-3xl font-bold text-var-col">
          Sizes
        </header>
        <div className="flex max-w-[25rem]">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Measure the size of your files when compressed with algorithms used across the web!
              (deflate, gzip, brotli)
            </li>
            <li>
              Works when JavaScript is disabled, so you know I&apos;m not fingerprinting your
              browser. (I will eat your files though 🙂)
            </li>
            <li>
              Has more themes than you&apos;ll ever need for an app like this! (29 &amp; random
              themes)
            </li>
          </ul>
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

export default SizesCard
