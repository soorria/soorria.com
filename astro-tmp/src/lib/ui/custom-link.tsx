import { type AnchorHTMLAttributes } from 'react'
import { cx } from '../utils/styles'

const defaultClassName =
  'text-drac-pink underline hocus:text-drac-purple focus-ring rounded-sm -mx-1 px-1 -mb-0.5 pb-0.5 break-words'

const CustomLink: React.FC<{ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  children,
  className: _className,
  ...rest
}) => {
  const usePlainLink = href.startsWith('#') || !href.startsWith('/')
  const isExternal = href.startsWith('http')
  const className = cx(defaultClassName, _className)
  return usePlainLink ? (
    <a
      href={href}
      className={className}
      {...rest}
      {...(isExternal
        ? {
            rel: 'noopener noreferrer',
            target: '_blank',
          }
        : {})}
    >
      {children}
    </a>
  ) : (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  )
}

export default CustomLink
