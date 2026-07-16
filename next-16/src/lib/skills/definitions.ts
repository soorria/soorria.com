export const SKILLS = [
  { label: 'JavaScript' },
  { label: 'TypeScript' },
  { label: 'Kotlin' },
  { label: 'PostgreSQL' },
  { label: 'MongoDB' },
  { label: 'React' },
  { label: 'Vue.js' },
  { label: 'SolidJS' },
  { label: 'Python' },
  { label: 'HTML' },
  { label: 'CSS' },
  { label: 'Next.js' },
  { label: 'Remix.run' },
  { label: 'Express.js' },
  { label: 'Flask' },
  { label: 'FastAPI' },
  { label: 'Jest' },
  { label: 'Cypress' },
  { label: 'Spring' },
  { label: 'CI/CD' },
  { label: 'Docker' },
  { label: 'Lambda' },
  { label: 'Terraform' },
  { label: 'NuxtJS' },
  { label: 'Astro' },
  { label: 'Hono' },
  { label: 'Hono ' },
  { label: 'Redis' },
  { label: 'Cloudflare' },
  { label: 'Sentry' },
  { label: 'Preact' },
  { label: 'Svelte' },
  { label: 'Deno' },
  { label: 'jQuery' },
  { label: 'Tailwind' },
] as const

export const getRandomSkillIndexes = (n = 8): number[] => {
  return SKILLS.map((_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
}

export const SKILLS_MAGIC_NUMBERS = {
  rootWidthPx: 832,
  imageWidthPx: 86,
  numColumns: 4,
  gapPx: 48,
  aspectRatio: 16 / 9,

  sendMessageTimeoutMs: 50,

  maxIcons: 64,
}
