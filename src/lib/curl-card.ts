import { links } from '@/links'
import stringWidth from 'string-width'
import kleur from 'kleur'

const LINKS: Array<{ text: string; title: string; color?: (title: string) => string }> = [
  {
    text: 'https://soorria.com',
    title: 'Website',
    color: kleur.magenta().inverse,
  },
  {
    text: links.github.href,
    title: 'GitHub',
    color: kleur.green().inverse,
  },
  {
    text: links.email.href.replace('mailto:', ''),
    title: 'Email',
    color: kleur.red().inverse,
  },
  {
    text: links.messenger.href,
    title: 'Messenger',
    color: kleur.blue().inverse,
  },
  {
    text: links.twitter.href,
    title: 'Twitter',
    color: kleur.cyan().inverse,
  },
  {
    text: links.linkedin.href,
    title: 'LinkedIn',
    color: kleur.blue().inverse,
  },
  {
    text: links.card.href,
    title: 'All Links',
    color: kleur.magenta().inverse,
  },
]

const longestLength = Math.max(...LINKS.map(link => link.title.length))

const printLinkTitle = (link: typeof LINKS[0]): string => {
  const titleText = ` ${link.title} `
  return kleur.bold(link.color?.(titleText) ?? titleText)
}

const getHeading = () => {
  const lines = String.raw`
 _  _              ___ _         ___                 _      _ 
| || |___ _  _    |_ _( )_ __   / __|___ ___ _ _ _ _(_)__ _| |
| __ / -_| || |_   | ||/| '  \  \__ / _ / _ | '_| '_| / _${'`'} |_|
|_||_\___|\_, ( ) |___| |_|_|_| |___\___\___|_| |_| |_\__,_(_)
          |__/|/                                              
`
    .split('\n')
    .filter(Boolean)

  return lines
    .map((line, i) => {
      const length = line.length
      const third = Math.floor(length / 3)
      const leftBreak = third + (lines.length - i)
      const rightBreak = third * 2 + (lines.length - i)
      return (
        kleur.magenta(line.slice(0, leftBreak)) +
        kleur.white(line.slice(leftBreak, rightBreak)) +
        kleur.blue(line.slice(rightBreak))
      )
    })
    .join('\n')
}

export const getFullMessage = (): string => {
  kleur.enabled = true

  return (
    boxContent(
      `${kleur.bold(getHeading())}


I'm a full stack software engineer passionate about creating
performant and ${kleur
        .bold()
        .italic(
          kleur.magenta('f') + kleur.white('u') + kleur.blue('n')
        )} software that enables users to do more
with less.

Here are some of my links:

${LINKS.map(
  link =>
    `${printLinkTitle(link)}${' '.repeat(longestLength - link.title.length + 4)}${kleur.underline(
      link.text
    )}`
).join('\n')}
`,
      62,
      `== ${kleur.bold('Soorria Saruva')} ==`
    ) + '\n'
  )
}

/**
 * The following 2 functions are heavily copied / adapted from Sindre
 * Sorhus' Boxen found here: https://github.com/sindresorhus/boxen.
 *
 * Copied since the library relies on Node built-ins and I want to run
 * this in Cloudflare's Edge Runtime via Vercel.
 */

const makeTitle = (text: string, horizontal: string) => {
  let title = ''

  const textWidth = stringWidth(text)

  horizontal = horizontal.slice(textWidth)

  if (horizontal.length % 2 === 1) {
    // This is needed in case the length is odd
    horizontal = horizontal.slice(Math.floor(horizontal.length / 2))
    title = horizontal.slice(1) + text + horizontal // We reduce the left part of one character to avoid the bar to go beyond its limit
  } else {
    horizontal = horizontal.slice(horizontal.length / 2)
    title = horizontal + text + horizontal
  }

  return title
}

const boxContent = (content: string, contentWidth = 62, title: string) => {
  const NEWLINE = '\n'
  const PAD = ' '
  const BORDERS_WIDTH = 2

  const padding = {
    top: 1,
    bottom: 1,
    left: 4,
    right: 4,
  }

  const colorizeBorder = (border: string) => {
    return kleur.magenta(border)
  }

  const chars = {
    topLeft: '╭',
    top: '─',
    topRight: '╮',
    right: '│',
    bottomRight: '╯',
    bottom: '─',
    bottomLeft: '╰',
    left: '│',
  }
  const columns = 80
  const marginLeft = ''

  const top = colorizeBorder(
    NEWLINE.repeat(0) +
      marginLeft +
      chars.topLeft +
      makeTitle(title, chars.top.repeat(contentWidth + padding.left + padding.right)) +
      chars.topRight
  )
  const bottom = colorizeBorder(
    marginLeft +
      chars.bottomLeft +
      chars.bottom.repeat(contentWidth + padding.left + padding.right) +
      chars.bottomRight +
      NEWLINE.repeat(0)
  )

  const LINE_SEPARATOR = contentWidth + BORDERS_WIDTH + 0 >= columns ? '' : NEWLINE

  const lines = [
    ...Array.from({ length: padding.top }, _ => PAD),
    ...content.split(NEWLINE),
    ...Array.from({ length: padding.bottom }, _ => PAD),
  ]

  const middle = lines
    .map(line => {
      const paddedLine =
        PAD.repeat(padding.left) +
        line +
        PAD.repeat(contentWidth - stringWidth(line) + padding.right)
      return marginLeft + colorizeBorder(chars.left) + paddedLine + colorizeBorder(chars.right)
    })
    .join(LINE_SEPARATOR)

  return top + LINE_SEPARATOR + middle + LINE_SEPARATOR + bottom
}
