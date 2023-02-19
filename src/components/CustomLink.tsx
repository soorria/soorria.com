import { ComponentProps, ParentComponent, splitProps } from 'solid-js'
import { A } from 'solid-start'

import cx from '~/utils/cx'

const CustomLink: ParentComponent<{ href: string } & ComponentProps<'a'>> = props => {
  const [, rest] = splitProps(props, ['class', 'children'])
  const c = () => cx('link', props.class)
  return (
    <>
      {props.href.startsWith('http') ? (
        <a rel="noopenner noreferrer" target="_blank" class={c()} {...rest}>
          {props.children}
        </a>
      ) : (
        <A class={c()} {...rest}>
          {props.children}
        </A>
      )}
    </>
  )
}

export default CustomLink
