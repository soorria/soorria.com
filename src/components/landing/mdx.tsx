import { minimalComponents } from '~/components/mdx/minimal'
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client'
import { createMemo, ValidComponent, Accessor, Component } from 'solid-js'

// eslint-disable-next-line react/display-name
const withCommonComponents = (Component: Component<MDXContentProps>) => () =>
  <Component components={minimalComponents} />

export const useMdxComponent = (code?: string | null | undefined): Accessor<ValidComponent> => {
  return createMemo(() => {
    if (!code) return props => props.children
    return withCommonComponents(getMDXComponent(code))
  })
}

export const useMdxComponents = (
  code?: string[] | null | undefined
): Accessor<ValidComponent[]> => {
  return createMemo(
    () =>
      code?.map(singleComponentCode =>
        withCommonComponents(getMDXComponent(singleComponentCode))
      ) ?? []
  )
}
