'use client'

import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import cx from '~/utils/cx'
import { COMMON_CLASSNAMES } from '../utils'
import type React from 'react'
import promptRacerImg from './prompt-racer.webp'

interface ProjectFrontMatter {
  slug: string
  title: string
  shortDescription: string
  stack: string[]
  source?: string
  live?: string
  wip?: boolean
  hasContent?: boolean
}

interface PromptRacerCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded-sm hocus:text-[#22c55e] hocus:bg-white focus-ring'

const promptRacerColors = {
  primary: '#22c55e',
}

const PromptRacerCard: React.FC<PromptRacerCardProps> = ({ project }) => {
  return (
    <div className="sm:col-span-2" id={`${project.slug}`}>
      <div className={cx('bg-[#272933]', COMMON_CLASSNAMES.specialCardRoot)}>
        <div className="absolute inset-0 grid grid-cols-3 overflow-hidden rounded-xl p-1">
          <div className="col-span-2 col-start-2 text-right">
            <img
              src={promptRacerImg.src}
              alt="popup showing a user has won an llm-prompting code race"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="absolute -inset-4 bg-linear-to-r from-[#272933] via-[#272933] to-[#27293300] sm:to-transparent" />
        <div
          className="relative z-10 flex h-full flex-col space-y-4 rounded-xl p-8 ring-4 ring-inset ring-drac-pink"
          style={{
            '--tw-ring-color': promptRacerColors.primary,
          } as React.CSSProperties}
        >
          <header className="font-display text-3xl font-bold italic">
            PROMPT
            <span style={{ color: promptRacerColors.primary }}>RACER</span>
          </header>
          <div className="max-w-[25rem] flex-1 space-y-4">
            <ul className="list-disc space-y-4 pl-6">
              <li>Put your AI prompting skills to the test in a game of speed and intelligence.</li>
              <li>
                &quot;Practice&quot; for coding interviews without feeling guilty about wasting
                time!
              </li>
              <li>
                Leaderboard so you can stroke your ego, and show off your prompt engineering
                prowess.
              </li>
            </ul>
          </div>
          <div className="-m-4 mb-0">
            {project.hasContent && (
              <a href={`/projects/${project.slug}`} className={cardLinkClassName}>
                <InfoIcon className="inline-block h-4 w-4" />
                <span>Details</span>
                <span className="sr-only"> for {project.title}</span>
              </a>
            )}
            <a
              className={cardLinkClassName}
              target="_blank"
              rel="noopener noreferrer"
              href={project.live}
            >
              <ExternalIcon className="inline-block h-4 w-4" />
              <span>
                Play <span className="sr-only">{project.title}</span> Now
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

export default PromptRacerCard
