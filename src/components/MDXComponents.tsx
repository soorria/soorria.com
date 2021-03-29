import { useState } from 'react'
import CustomLink from './CustomLink'

const COPIED_CLICK_TIMEOUT = 2000
const LANGUAGE_NAME_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript react',
  ts: 'typescript',
  tsx: 'typescript react',
  md: 'markdown',
}
const CustomCodeBlock: React.FC<any> = ({ children, className, ...rest }) => {
  const [copied, setCopied] = useState(false)

  if (!className?.startsWith('language-')) {
    return <pre className={className}>{children}</pre>
  }

  const languageFromClassName: string = className.split('language-')[1]
  const language =
    languageFromClassName in LANGUAGE_NAME_MAP
      ? LANGUAGE_NAME_MAP[languageFromClassName]
      : languageFromClassName

  return (
    <div className="relative p-2 sm:p-4 -mx-2 sm:-mx-4 rounded ring-1 sm:ring-2 ring-drac-purple my-[1.7em]">
      <div className="flex items-center justify-between mb-2 text-sm font-bold tracking-wide uppercase font-display ">
        <div className="text-xs sm:text-sm text-drac-purple">{language}</div>
        <button
          className="px-2 font-bold tracking-wider rounded text-drac-bg bg-drac-purple focus:ring-offset-current focus:ring-2 focus:ring-offset-2 focus:ring-drac-purple focus:outline-none"
          onClick={async event => {
            const textToCopy = (event as any).target.parentElement?.parentElement?.childNodes[1]
              .innerText
            await navigator.clipboard.writeText(textToCopy)
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, COPIED_CLICK_TIMEOUT)
          }}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className={className} {...rest}>
        {children}
      </pre>
    </div>
  )
}

export const components: Record<string, React.ComponentType<any>> = {
  a: CustomLink,
  pre: CustomCodeBlock,
}
