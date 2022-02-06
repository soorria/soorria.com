import { ReactNode } from 'react'
import {
  EmailIcon,
  FacebookIconSolid,
  GithubIconSolid,
  IconComponent,
  LinkedinIconSolid,
  MALIconSolid,
  TwitterIconSolid,
} from './components/icons'
import Logo from './components/logo'
import { GITHUB_URL } from './constants'

interface Link {
  title: ReactNode
  href: string
  icon: IconComponent
  newTab?: boolean
}

const githubLink: Link = {
  title: 'mo0th',
  href: GITHUB_URL,
  icon: GithubIconSolid,
}

const emailLink: Link = {
  title: 'soorria.ss@gmail.com',
  href: 'mailto:soorria.ss@gmail.com',
  icon: EmailIcon,
}

const linkedinLink: Link = {
  title: 'soorria',
  href: 'https://www.linkedin.com/in/soorria/',
  icon: LinkedinIconSolid,
}

const twitterLink: Link = {
  title: '@soorriously',
  href: 'https://twitter.com/soorriously',
  icon: TwitterIconSolid,
}

const facebookLink: Link = {
  href: 'https://www.facebook.com/soorriously/',
  title: 'soorriously',
  icon: FacebookIconSolid,
}

const malLink: Link = {
  href: 'https://myanimelist.net/profile/soorriously',
  title: 'soorriously',
  icon: MALIconSolid,
}

const siteLink: Link = {
  href: 'https://mooth.tech',
  title: 'website',
  icon: Logo,
  newTab: false,
}

export const links = {
  email: emailLink,
  github: githubLink,
  linkedin: linkedinLink,
  twitter: twitterLink,
  facebook: facebookLink,
  mal: malLink,
  site: siteLink,
} as const

export const contactLinks: Link[] = [githubLink, emailLink, linkedinLink, facebookLink, twitterLink]

export const allLinks: Link[] = [...contactLinks, malLink]
