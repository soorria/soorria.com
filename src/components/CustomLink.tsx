import cx from '@/utils/cx'
import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'

const defaultClassName = 'text-drac-pink underline hocus:text-drac-purple'

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
    <Link href={href} passHref>
      <a className={className} {...rest}>
        {children}
      </a>
    </Link>
  )
}

export default CustomLink
