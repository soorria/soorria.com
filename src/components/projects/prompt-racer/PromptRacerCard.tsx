'use client'

import type { ProjectFrontMatter } from '~/types/project'
import NextLink from 'next/link'
import { CodeIcon, ExternalIcon, InfoIcon } from '~/components/icons'
import cx from '~/utils/cx'
import { COMMON_CLASSNAMES } from '../utils'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import promptRacerImg from './prompt-racer.webp'

interface PokelifeCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded hocus:text-[#22c55e] hocus:bg-white focus-ring'

const promptRacerColors = {
  primary: '#22c55e',
}

const PromptRacerCard: React.FC<PokelifeCardProps> = ({ project }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]) {
          setShouldAnimate(entries[0].isIntersecting)
        }
      },
      {
        threshold: [0],
      }
    )

    obs.observe(root.current)

    return () => {
      obs.disconnect()
    }
  }, [])

  // const comingSoonTag = (
  //   <span className="inline-block -translate-y-px rounded bg-green-500/50 px-1 pb-px text-xs text-green-200">
  //     coming soon
  //   </span>
  // )

  return (
    <div className="sm:col-span-2" id={`${project.slug}`}>
      <div ref={root} className={cx('bg-[#272933]', COMMON_CLASSNAMES.specialCardRoot)}>
        <div className="absolute inset-0 grid grid-cols-3 overflow-hidden rounded-xl p-1">
          <div className="col-span-2 col-start-2 text-right">
            <Image
              src={promptRacerImg}
              alt="popup showing a user has won an llm-prompting code race"
              className="h-full w-full object-cover"
            />
          </div>
          {/* <noscript className="col-span-2 col-start-2 grid items-center justify-end p-12">
            <p className="hidden w-48 text-right text-xl sm:block">
              Enable JavaScript to see a demo here!
            </p>
          </noscript> */}
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-[#272933] via-[#272933] to-[#27293300] sm:to-transparent" />
        <div
          className="relative z-10 flex h-full flex-col space-y-4 rounded-xl p-8 ring-4 ring-inset ring-drac-pink"
          style={{
            '--tw-ring-color': promptRacerColors.primary,
          }}
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
              {/* <li>
                {comingSoonTag} Create, upgrade and share coding bots with custom system prompts and
                alternative models.
              </li> */}
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
