import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client'
import { createMemo, VoidComponent, Accessor } from 'solid-js'
import Fragment from '~/components/Fragment'

// eslint-disable-next-line react/display-name
const withCommonComponents = (Component: VoidComponent<MDXContentProps>) => () =>
  <Component components={{}} />

export const useMdxComponent = (
  code?: Accessor<string | null | undefined>
): Accessor<VoidComponent> => {
  return createMemo(() => {
    const c = code?.()
    if (!c) return Fragment
    return withCommonComponents(getMDXComponent(c))
  })
}

export const useMdxComponents = (code?: string[] | null | undefined): Accessor<VoidComponent[]> => {
  return createMemo(
    () =>
      code?.map(singleComponentCode =>
        withCommonComponents(getMDXComponent(singleComponentCode))
      ) ?? []
  )
}
