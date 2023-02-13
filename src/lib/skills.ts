import { Accessor, createSignal } from 'solid-js'

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

export type UseSkillsInput = {
  defaultIndexes?: number[]
  defaultShowAll?: boolean
}

export type UseSkillsResult = {
  skills: Accessor<string[]>
  shuffle: (n?: number) => void
  showAll: Accessor<boolean>
  toggleShowAll: (next?: boolean) => void
}

export const useSkills = (props: UseSkillsInput): UseSkillsResult => {
  const [indexes, setIndexes] = createSignal(
    (() => {
      if (props.defaultIndexes) return props.defaultIndexes
      return getRandomSkillIndexes()
    })()
  )
  const shuffle = (n?: number) => {
    const newIndices = getRandomSkillIndexes(n ?? indexes().length)
    setIndexes(() => newIndices)
  }

  const [showAll, setShowAll] = createSignal(props.defaultShowAll ?? false)

  const skills = () => (showAll() ? SKILLS : indexes().map(i => SKILLS[i]!))

  return {
    skills,
    shuffle,
    toggleShowAll: (v?: boolean) => setShowAll(typeof v === 'undefined' ? curr => !curr : v),
    showAll,
  }
}

export const getRandomSkillIndexes = (n = 8): number[] => {
  return SKILLS.map((_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
}
