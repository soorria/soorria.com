'use client'

import { PropsWithChildren, useCallback, useReducer, useState } from 'react'
import { getRandomSkillIndexes, SKILLS } from '~/lib/skills'
import cx from '~/utils/cx'
import CustomLink from '../CustomLink'
import { RefreshIcon } from '../icons'
import LandingSection from './LandingSection'

const titles = ["What I've Learned", 'Technical Skills', 'Tools I Use']

export type UseSkillsInput = {
  defaultIndexes?: number[]
  defaultShowAll?: boolean
}

export type UseSkillsResult = {
  skills: string[]
  shuffle: (n?: number) => void
  showAll: boolean
  toggleShowAll: (next?: boolean) => void
}

const useSkills = ({ defaultIndexes, defaultShowAll = false }: UseSkillsInput): UseSkillsResult => {
  const [indexes, setIndexes] = useState(() => {
    if (defaultIndexes) return defaultIndexes
    return getRandomSkillIndexes()
  })
  const shuffle = useCallback(
    (n?: number) => {
      setIndexes(getRandomSkillIndexes(n ?? indexes.length))
    },
    [indexes.length]
  )

  const [showAll, toggleShowAll] = useReducer<(v: boolean, next?: boolean) => boolean, boolean>(
    (v, next) => (typeof next === 'undefined' ? !v : next),
    defaultShowAll,
    () => defaultShowAll
  )

  const skills = showAll ? SKILLS : indexes.map(i => SKILLS[i]!)

  return { skills, shuffle, toggleShowAll, showAll }
}

const SkillListItem: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <li className="group flex items-center space-x-2">
      <span className="h-2 w-2 transform rounded-full border-2 border-drac-content transition group-hover:border-drac-pink" />
      <span>{children}</span>
    </li>
  )
}

const classes = {
  buttonCommon:
    'rounded bg-drac-base-light px-2 py-1 text-drac-content transition-colors hocus:text-drac-purple focus-ring',
}

const Skills: React.FC<{ random?: number; skillIndexes: number[] }> = ({
  random = 0,
  skillIndexes,
}) => {
  const { skills, shuffle, toggleShowAll, showAll } = useSkills({ defaultIndexes: skillIndexes })
  const title = titles[random % titles.length]

  return (
    <LandingSection id="skills" title={title}>
      <p className="mb-8 text-lg">
        Here are some of the technicals skills during my degree, work, and just out of curiosity.
      </p>
      <ul className="mb-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {skills.map(skill => (
          <SkillListItem key={skill}>{skill}</SkillListItem>
        ))}
        {showAll ? <SkillListItem>Adding random &ldquo;features&rdquo;</SkillListItem> : null}
      </ul>
      <div className="space-y-4 text-center text-sm">
        <div className="flex items-center justify-center space-x-1">
          <button onClick={() => toggleShowAll()} className={classes.buttonCommon}>
            {showAll ? 'Show a random set of my skills' : "Show all the tech I've learned"}
          </button>
          <span>&nbsp;/&nbsp;</span>
          <button
            onClick={() => {
              if (showAll) toggleShowAll(false)
              shuffle()
            }}
            className={cx('flex items-center', classes.buttonCommon)}
          >
            <RefreshIcon className="mr-1 inline-block h-em w-em" /> Randomise skills
          </button>
        </div>
        <p>
          Want to see a pointlessly long list of languages I&apos;ve used?
          <br />
          Check out my{' '}
          <CustomLink href="/snippets/hello-world" className="font-mono">
            hello-world
          </CustomLink>{' '}
          snippet.
        </p>
      </div>
    </LandingSection>
  )
}

export default Skills
