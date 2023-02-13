import { ComponentProps, ParentComponent, splitProps } from 'solid-js'
import { A } from 'solid-start'
import cx from '~/utils/cx'

const defaultClassName =
  'text-drac-pink underline hocus:text-drac-purple focus-ring rounded -mx-1 px-1 -mb-0.5 pb-0.5'

const CustomLink: ParentComponent<{ href: string } & ComponentProps<'a'>> = props => {
  const [, rest] = splitProps(props, ['class', 'children'])
  return (
    <>
      {props.href.startsWith('http') ? (
        <a
          rel="noopenner noreferrer"
          target="_blank"
          class={cx(defaultClassName, props.class)}
          {...rest}
        >
          {props.children}
        </a>
      ) : (
        <A class={props.class} {...rest}>
          {props.children}
        </A>
      )}
    </>
  )
}

export default CustomLink
