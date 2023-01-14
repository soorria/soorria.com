import type { AnchorHTMLAttributes } from 'react'
import cx from '~/utils/cx'
import Link from 'next/link'

const defaultClassName =
  'text-drac-pink underline hocus-visible:text-drac-purple focus-ring rounded -mx-1 px-1 -mb-0.5 pb-0.5'

const CustomLink: React.FC<{ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  children,
  className: _className,
  ...rest
}) => {
  const isExternal = href.startsWith('http')
  const className = cx(defaultClassName, _className)
  return isExternal ? (
    <a href={href} rel="noopenner noreferrer" target="_blank" className={className} {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} passHref className={className} {...rest}>
      {children}
    </Link>
  )
}

export default CustomLink
