import type React from 'react'
import cx from '~/utils/cx'

export const COMMON_CLASSNAMES = {
  codeAndDemoRoot:
    'relative -mx-2 rounded-sm p-2 ring-2 ring-drac-purple md:-mx-6 md:py-4 md:px-6 bg-drac-base',
} as const

export const CODE_BLOCK_CLASSNAMES = {
  button:
    'rounded-sm bg-drac-purple px-2 font-bold tracking-wider text-drac-base focus:outline-hidden focus:ring-2 focus:ring-drac-pink focus:ring-offset-2 focus:ring-offset-current text-center transition text-sm font-bold font-display cursor-pointer',
  root: cx('my-7 pb-0! overflow-hidden', COMMON_CLASSNAMES.codeAndDemoRoot),
  pre: 'my-0!',
  header: 'mb-4 flex items-center space-x-2 font-display text-sm font-bold tracking-wide',
  languageTitle: 'text-sm uppercase text-drac-purple sm:text-sm',
} as const

export const DEMO_CLASSNAMES = {
  root: COMMON_CLASSNAMES.codeAndDemoRoot,
  reload:
    'focus-ring flex h-full w-full items-center justify-center rounded-sm bg-drac-base text-drac-pink transition hocus:bg-drac-base-dark hocus:text-drac-purple',
  footer: 'absolute inset-x-0 bottom-0 h-20 bg-drac-purple/50 p-4 md:px-6',
  spacing: 'h-24',
} as const
