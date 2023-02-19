import { JSXElement } from 'solid-js'

import {
  DiscordIcon,
  EmailIcon,
  FacebookIconSolid,
  GithubIconSolid,
  IconComponent,
  LinkedinIconSolid,
  LinkIcon,
  MALIconSolid,
  MessengerIcon,
  TwitterIconSolid,
} from './components/icons'
import Logo from './components/logo'
import { GITHUB_URL } from './constants'

interface Link {
  title: string | (() => JSXElement)
  href: string
  icon: IconComponent
  iconAlt: string
  newTab?: boolean
}

const githubLink: Link = {
  title: 'soorria',
  iconAlt: 'github',
  href: GITHUB_URL,
  icon: GithubIconSolid,
}

const emailLink: Link = {
  title: 'soorria.ss@gmail.com',
  iconAlt: 'email',
  href: 'mailto:soorria.ss@gmail.com',
  icon: EmailIcon,
}

const linkedinLink: Link = {
  title: 'soorria',
  iconAlt: 'linkedin',
  href: 'https://www.linkedin.com/in/soorria/',
  icon: LinkedinIconSolid,
}

const twitterLink: Link = {
  title: '@soorriously',
  iconAlt: 'twitter',
  href: 'https://twitter.com/soorriously',
  icon: TwitterIconSolid,
}

const facebookLink: Link = {
  href: 'https://www.facebook.com/soorriously/',
  iconAlt: 'facebook',
  title: 'soorriously',
  icon: FacebookIconSolid,
}

const messengerLink: Link = {
  href: 'https://www.messenger.com/t/soorriously',
  iconAlt: 'messenger',
  title: 'soorriously',
  icon: MessengerIcon,
}

const malLink: Link = {
  href: 'https://myanimelist.net/profile/soorriously',
  iconAlt: 'my anime list',
  title: 'soorriously',
  icon: MALIconSolid,
}

const siteLink: Link = {
  href: 'https://soorria.com',
  iconAlt: 'purple and pink square',
  title: 'website',
  icon: Logo,
  newTab: false,
}

const discordLink: Link = {
  href: 'https://discordapp.com/users/405653727383388162',
  iconAlt: 'discord',
  title: 'mooth#2369',
  icon: DiscordIcon,
}

const cardLink: Link = {
  href: 'https://links.soorria.com',
  iconAlt: 'link',
  title: 'all links',
  icon: LinkIcon,
}

export const links = {
  email: emailLink,
  github: githubLink,
  linkedin: linkedinLink,
  twitter: twitterLink,
  facebook: facebookLink,
  mal: malLink,
  site: siteLink,
  discord: discordLink,
  card: cardLink,
  messenger: messengerLink,
} as const

export const contactLinks: Link[] = [
  githubLink,
  emailLink,
  messengerLink,
  twitterLink,
  linkedinLink,
  cardLink,
]

export const allLinks: Link[] = [...contactLinks, discordLink, malLink, facebookLink, cardLink]
