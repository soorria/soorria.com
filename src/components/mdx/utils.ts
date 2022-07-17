import cx from '@/utils/cx'

export const COMMON_CLASSNAMES = {
  codeAndDemoRoot: 'relative -mx-2 rounded p-2 ring-2 ring-drac-purple md:-mx-6 md:py-4 md:px-6',
}

export const CODE_BLOCK_CLASSNAMES = {
  button:
    'rounded bg-drac-purple px-2 font-bold tracking-wider text-drac-bg focus:outline-none focus:ring-2 focus:ring-drac-purple focus:ring-offset-2 focus:ring-offset-current',
  root: cx('my-7 !pb-0', COMMON_CLASSNAMES.codeAndDemoRoot),
  pre: '!my-0',
  header: 'mb-4 flex items-center space-x-2 font-display text-sm font-bold tracking-wide',
  languageTitle: 'text-sm uppercase text-drac-purple sm:text-sm',
}

export const getTextFromNullablePre = (pre: HTMLPreElement | undefined | null): string => {
  if (!pre) return ''

  const firstCodeChild = Array.from(pre.children).find((el: Element) => el.tagName === 'CODE')
  if (!firstCodeChild) return pre.innerText

  return Array.from(firstCodeChild.children)
    .map(line => (line as HTMLElement).innerText || '')
    .join('\n')
}

export const LANGUAGE_NAME_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript react',
  ts: 'typescript',
  tsx: 'typescript react',
  md: 'markdown',
}
