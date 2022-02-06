import { useState } from 'react'

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

  if (className && className.includes('not-custom')) {
    return <pre className={className}>{children}</pre>
  }

  const languageFromClassName: string = className.split('language-')[1]
  const language =
    languageFromClassName in LANGUAGE_NAME_MAP
      ? LANGUAGE_NAME_MAP[languageFromClassName]
      : languageFromClassName

  return (
    <div className="relative -mx-2 my-[1.7em] rounded p-2 ring-1 ring-drac-purple sm:-mx-4 sm:p-4 sm:ring-2">
      <div className="mb-2 flex items-center justify-between font-display text-sm font-bold uppercase tracking-wide ">
        <div className="text-xs text-drac-purple sm:text-sm">{language}</div>
        <button
          className="rounded bg-drac-purple px-2 font-bold tracking-wider text-drac-bg focus:outline-none focus:ring-2 focus:ring-drac-purple focus:ring-offset-2 focus:ring-offset-current"
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

export default CustomCodeBlock
