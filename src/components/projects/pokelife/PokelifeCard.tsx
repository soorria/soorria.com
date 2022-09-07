import type { ProjectFrontMatter } from '@/types/project'
import NextLink from 'next/link'
import { CodeIcon, ExternalIcon, InfoIcon } from '@/components/icons'
import cx from '@/utils/cx'
import { COMMON_CLASSNAMES } from '../utils'
import type React from 'react'
import { ButtonHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

interface PokelifeCardProps {
  project: ProjectFrontMatter
}

const cardLinkClassName =
  'inline-flex items-center px-6 py-2 ml-4 mt-4 space-x-2 font-semibold transition-colors border-2 border-current border-white rounded hocus:text-drac-bg hocus:bg-white focus-ring'

const SettingButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  return (
    <button
      {...props}
      className="focus-ring -mx-1 cursor-pointer break-words break-all rounded px-1 underline disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}

const typesOptions = [['fire', 'water', 'grass'], ['ground', 'grass', 'poison'], []]

const PokelifeCard: React.FC<PokelifeCardProps> = ({ project }) => {
  const [delay, setDelay] = useState(100)
  const [destroyCpu, setDestroyCpu] = useState(false)
  const [types, setTypes] = useState(0)
  const [showDemo, setShowDemo] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  const url = useMemo(() => {
    const params = { embed: 'true' } as any
    if (destroyCpu) {
      params.size = 1
    } else {
      params.delay = delay
      params.types = typesOptions[types]?.join(',') ?? ''
    }
    return `https://pokelife.soorria.com/?${new URLSearchParams(params)}`
  }, [delay, destroyCpu, types])

  useEffect(() => {
    if (!root.current) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShowDemo(true)
          obs.disconnect()
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

  const isDataSaver = typeof window !== 'undefined' && (navigator as any)?.connection?.saveData

  return (
    <div
      id="pokelife"
      ref={root}
      className={cx('bg-[#272933] sm:col-span-2', COMMON_CLASSNAMES.specialCardRoot)}
    >
      <div className="absolute -inset-4 grid grid-cols-3 overflow-hidden rounded-xl">
        {!isDataSaver && showDemo && (
          <iframe
            title="Pokelife"
            tabIndex={-1}
            src={url}
            className="no-js-hidden col-span-2 col-start-2 ml-auto block h-full w-full rounded-xl"
          />
        )}
        <noscript className="col-span-2 col-start-2 grid items-center justify-end p-12">
          <style>{'.no-js-hidden{display:none}'}</style>
          <p className="hidden w-48 text-right text-xl sm:block">
            Enable JavaScript to see a demo here!
          </p>
        </noscript>
      </div>
      <div className="absolute -inset-4 bg-gradient-to-r from-[#272933] via-[#272933] to-[#27293377] sm:to-transparent" />
      <div className="relative z-10 flex h-full flex-col space-y-4 rounded-xl p-8 ring-4 ring-inset ring-drac-pink">
        <header className="font-display text-3xl font-bold">Pokelife</header>
        <div className="max-w-[25rem] flex-1">
          <ul className="list-disc space-y-4 pl-6">
            <li>
              Like Conway&apos;s Game of Life but with Pokemon types instead of boring 1s and 0s.
            </li>
            <li>
              Configurable settings for a{' '}
              <SettingButton
                disabled={delay === 0}
                onClick={() => setDelay(Math.max(delay - 50, 0))}
              >
                faster
              </SettingButton>{' '}
              or{' '}
              <SettingButton
                disabled={delay === 5000}
                onClick={() => setDelay(Math.min(delay + 50, 5000))}
              >
                slower
              </SettingButton>{' '}
              vizualisation, to{' '}
              <SettingButton onClick={() => setDestroyCpu(p => !p)}>
                {destroyCpu ? 'protect' : 'destroy'} your cpu
              </SettingButton>{' '}
              or{' '}
              <SettingButton onClick={() => setTypes((types + 1) % typesOptions.length)}>
                remove types you don&apos;t like
              </SettingButton>
              . <small>(click underlined words!)</small>
            </li>
            <li className="no-js-hidden">Embeddable, and mesmerising to look at →.</li>
            <li>
              Runs off the main thread so UI still works okay even on the most taxing settings.
            </li>
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
  )
}

export default PokelifeCard
