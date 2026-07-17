import { cloneElement, isValidElement, type AnchorHTMLAttributes, type ReactElement } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  passHref?: boolean
}

const CompatLink = ({ children, href, passHref: _, ...props }: Props) => {
  if (isValidElement(children) && children.type === 'a') {
    return cloneElement(children as ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>, {
      href,
    })
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

export default CompatLink
