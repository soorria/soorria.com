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

export const getRandomSkillIndexes = (n = 8): number[] => {
  return SKILLS.map((_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
}
