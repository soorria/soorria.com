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
import astroImg from './logos/astro.svg'
import honoImg from './logos/hono.svg'
import honoKawaiiImg from './logos/hono.png'
import redisImg from './logos/redis.svg'
import cloudflareImg from './logos/cloudflare.svg'
import sentryImg from './logos/sentry.svg'
import preactImg from './logos/preact.svg'
import svelteImg from './logos/svelte.svg'
import denoImg from './logos/deno.svg'
import jqueryImg from './logos/jquery.svg'
import tailwindImg from './logos/tailwind.svg'
import type { ImageMetadata } from 'astro'
import type { SKILLS } from './definitions'

export const skillLabelToImage: Record<(typeof SKILLS)[number]['label'], ImageMetadata> = {
  JavaScript: javascriptImg,
  TypeScript: typescriptImg,
  Kotlin: kotlinImg,
  PostgreSQL: postgresImg,
  MongoDB: mongoImg,
  React: reactImg,
  'Vue.js': vueImg,
  SolidJS: solidImg,
  Python: pythonImg,
  HTML: htmlImg,
  CSS: cssImg,
  'Next.js': nextImg,
  'Remix.run': remixImg,
  'Express.js': expressImg,
  Flask: flaskImg,
  FastAPI: fastapiImg,
  Jest: jestImg,
  Cypress: cypressImg,
  Spring: springImg,
  'CI/CD': githubImg,
  Docker: dockerImg,
  Lambda: awsImg,
  Terraform: terraformImg,
  NuxtJS: nuxtImg,
  Astro: astroImg,
  Hono: honoImg,
  'Hono ': honoKawaiiImg,
  Redis: redisImg,
  Cloudflare: cloudflareImg,
  Sentry: sentryImg,
  Preact: preactImg,
  Svelte: svelteImg,
  Deno: denoImg,
  jQuery: jqueryImg,
  Tailwind: tailwindImg,
}
