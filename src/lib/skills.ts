import { useCallback, useReducer, useState } from 'react'

export const SKILLS = [
  'TypeScript & JavaScript',
  'Kotlin',
  'Python',
  'HTML5 & CSS3',
  'React',
  'Next.js',
  'Remix.run',
  'Express.js',
  'Flask',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Jest',
  'Cypress',
  'Spring Boot',
  'GitLab CI',
  'Azure Functions',
  'GCP Functions',
  'Linux (Debian & Ubuntu)',
  'Vue.js',
  'NuxtJS',
  'Serverless',
  'SolidJS',
]

type UseSkillsInput = {
  defaultIndexes?: number[]
  defaultShowAll?: boolean
}

type UseSkillsResult = {
  skills: string[]
  shuffle: (n?: number) => void
  showAll: boolean
  toggleShowAll: (next?: boolean) => void
}

export const useSkills = ({
  defaultIndexes,
  defaultShowAll = false,
}: UseSkillsInput): UseSkillsResult => {
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

export const getRandomSkillIndexes = (n = 8): number[] => {
  return SKILLS.map((_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
}
