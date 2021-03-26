import Link from 'next/link'
import { useState } from 'react'

const CustomLink: React.FC<{ href: string } & Record<string, any>> = props => {
  const isExternal = props.href.startsWith('http')
  console.log({ props, isExternal })
  return isExternal ? (
    <a href={props.href} rel="noopenner noreferrer" target="_blank">
      {props.children}
    </a>
  ) : (
    <Link href={props.href} passHref>
      <a>{props.children}</a>
    </Link>
  )
}

const COPIED_CLICK_TIMEOUT = 2000
const CustomCodeBlock: React.FC<any> = ({ children, className, ...rest }) => {
  const [copied, setCopied] = useState(false)

  return (
    <div className="relative p-4 rounded ring-2 ring-drac-purple my-[1.7em]">
      <div className="flex justify-between mb-2 text-sm font-bold tracking-wide uppercase font-display ">
        <div className="text-drac-purple">{className.split('language-')[1]}</div>
        <button
          className="px-2 font-bold tracking-wide rounded text-drac-bg bg-drac-purple focus:ring-offset-current focus:ring-2 focus:ring-offset-2 focus:ring-drac-pink focus:outline-none"
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
