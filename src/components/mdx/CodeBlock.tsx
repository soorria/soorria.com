import cx from '@/utils/cx'
import { useCopy } from '@/utils/use-copy'
import { useEffect, useRef, useState } from 'react'
import { COMMON_CLASSNAMES } from './utils'

const LANGUAGE_NAME_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript react',
  ts: 'typescript',
  tsx: 'typescript react',
  md: 'markdown',
}

const classes = {
  button:
    'rounded bg-drac-purple px-2 font-bold tracking-wider text-drac-bg focus:outline-none focus:ring-2 focus:ring-drac-purple focus:ring-offset-2 focus:ring-offset-current',
}

const CustomCodeBlock: React.FC<any> = ({ children, className, ...rest }) => {
  const [copy, copied] = useCopy()
  const [content, setContent] = useState('')
  const pre = useRef<HTMLPreElement>()

  useEffect(() => {
    setContent(pre.current?.innerText ?? '')
  }, [])

  if (className && className.includes('not-custom')) {
    return <pre className={className}>{children}</pre>
  }

  const languageFromClassName: string = className.split('language-')[1]
  const language = LANGUAGE_NAME_MAP[languageFromClassName] ?? languageFromClassName

  return (
    <div className={cx('my-[1.7em]', COMMON_CLASSNAMES.codeAndDemoRoot)}>
      <div className="mb-2 flex items-center space-x-2 font-display text-sm font-bold tracking-wide">
        <div className="text-xs uppercase text-drac-purple sm:text-sm">{language}</div>
        <div className="flex-1" />
        {content && language.startsWith('typescript') && (
          <a
            type="button"
            className={cx(classes.button, '!text-drac-bg no-underline')}
            href={`https://utils.mooth.tech/remove-types?${new URLSearchParams({
              ref: 'mooth.tech',
              ts: content,
              copyWhenDone: 'on',
              ...(language.includes('react') ? { isTsx: 'on' } : {}),
            })}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            remove types
          </a>
        )}
        <button
          type="button"
          className={classes.button}
          onClick={() => copy(pre.current?.innerText || '')}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre ref={pre} className={className} {...rest}>
        {children}
      </pre>
    </div>
  )
}

export default CustomCodeBlock
