import type { StaticImageData } from 'next/image'
import javascriptImg from './logos/javascript.svg'
import typescriptImg from './logos/typescript.svg'
import kotlinImg from './logos/kotlin.svg'
import pythonImg from './logos/python.svg'
import htmlImg from './logos/html.svg'
import cssImg from './logos/css.svg'
import reactImg from './logos/react.svg'
import nextImg from './logos/nextjs.svg'
import remixImg from './logos/remix.svg'
import expressImg from './logos/express.svg'
import flaskImg from './logos/flask.svg'
import fastapiImg from './logos/fastapi.svg'
import postgresImg from './logos/postgres.svg'
import mongoImg from './logos/mongodb.svg'
import jestImg from './logos/jest.svg'
import cypressImg from './logos/cypress.svg'
import springImg from './logos/spring-boot.svg'
import githubImg from './logos/github-actions.svg'
import dockerImg from './logos/docker.svg'
import awsImg from './logos/aws-lambda.svg'
import terraformImg from './logos/terraform.svg'
import vueImg from './logos/vue.svg'
import nuxtImg from './logos/nuxt.svg'
import solidImg from './logos/solidjs.svg'

export type SkillDefinition = {
  label: string
  img: StaticImageData
}

export const SKILLS: SkillDefinition[] = [
  { label: 'JavaScript', img: javascriptImg as StaticImageData },
  { label: 'TypeScript', img: typescriptImg as StaticImageData },
  { label: 'Kotlin', img: kotlinImg as StaticImageData },
  { label: 'PostgreSQL', img: postgresImg as StaticImageData },
  { label: 'MongoDB', img: mongoImg as StaticImageData },
  { label: 'React', img: reactImg as StaticImageData },
  { label: 'Vue.js', img: vueImg as StaticImageData },
  { label: 'SolidJS', img: solidImg as StaticImageData },
  { label: 'Python', img: pythonImg as StaticImageData },
  { label: 'HTML', img: htmlImg as StaticImageData },
  { label: 'CSS', img: cssImg as StaticImageData },
  { label: 'Next.js', img: nextImg as StaticImageData },
  { label: 'Remix.run', img: remixImg as StaticImageData },
  { label: 'Express.js', img: expressImg as StaticImageData },
  { label: 'Flask', img: flaskImg as StaticImageData },
  { label: 'FastAPI', img: fastapiImg as StaticImageData },
  { label: 'Jest', img: jestImg as StaticImageData },
  { label: 'Cypress', img: cypressImg as StaticImageData },
  { label: 'Spring', img: springImg as StaticImageData },
  { label: 'CI/CD', img: githubImg as StaticImageData },
  { label: 'Docker', img: dockerImg as StaticImageData },
  { label: 'Lambda', img: awsImg as StaticImageData },
  { label: 'Terraform', img: terraformImg as StaticImageData },
  { label: 'NuxtJS', img: nuxtImg as StaticImageData },
]

export const getRandomSkillIndexes = (n = 8): number[] => {
  return SKILLS.map((_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
}
