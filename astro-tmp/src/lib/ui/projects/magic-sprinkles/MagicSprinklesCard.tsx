import { CodeIcon, ExternalIcon, InfoIcon } from '~/lib/ui/icons'
import { cx } from '~/lib/utils/styles'
import { COMMON_CLASSNAMES } from '../utils'
import type React from 'react'
import type { ProjectFrontMatter } from '~/lib/data/types'
import ShowWhenVisible from '~/lib/utils/show-when-visible.react'
import { LazyMagicSprinkles } from '~/lib/magic-sprinkles/magic-sprinkles.lazy'
import Sparkles from '../../sparkles'

interface MagicSprinklesCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded-sm hocus:text-drac-base hocus:bg-white focus-ring'

const MagicSprinklesCard: React.FC<MagicSprinklesCardProps> = ({ project }) => {
  return (
    <div className="group sm:col-span-2" id={project.id}>
      <div className={cx(COMMON_CLASSNAMES.specialCardRoot, '*:rounded-lg')}>
        <div
          className="rainbow-gradient absolute inset-0"
          style={{ animation: 'bg-slide 5s linear infinite' }}
        ></div>
        <div className="bg-drac-base absolute inset-1"></div>
        <div className="absolute -inset-x-6 -inset-y-4 grid -translate-x-0.5">
          <ShowWhenVisible className="md:group-hocus-within:scale-[0.952] transition-transform">
            <LazyMagicSprinkles />
          </ShowWhenVisible>
          <div className="no-js-grid col-span-2 col-start-2 hidden items-center justify-end p-12">
            <p className="hidden w-48 text-right text-xl sm:block">
              Enable JavaScript to see a demo here!
            </p>
          </div>
        </div>
        <div className="from-drac-base via-drac-base absolute inset-1 bg-linear-to-r to-transparent md:via-25%" />
        <div className="relative inset-1 z-10 flex h-full flex-col space-y-4 bg-transparent p-6">
          <header className="font-display pl-1 text-3xl font-bold">
            <Sparkles>{project.data.title}</Sparkles>
          </header>
          <div className="max-w-[25rem] flex-1">
            <ul className="list-disc space-y-4 pl-6">
              <li className="no-js-hidden">Easily embeddable, and way too fun to play with →</li>
              <li>
                Works seamlessly on mobile, so you can enjoy{' '}
                <span className="font-display font-bold">magic sprinkles</span> on the go! No more
                boring toilet breaks!
              </li>
              <li>
                Increases user retention by at least 1000%!!1! No questions asked, 100% money-back
                guarantee<sup>*</sup>
                <br />
                <small className="text-[0.5rem]">
                  <sup>*</sup>(note: if you paid for this, you were scammed)
                </small>
              </li>
              <li className="text-xs text-pretty sm:hidden">
                If you&apos;re on mobile, scrolling won&apos;t work while your finger is on this
                card.
              </li>
            </ul>
          </div>
          <div className="-m-3 mb-0! pb-3">
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
              <span>See full version</span>
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

export default MagicSprinklesCard
