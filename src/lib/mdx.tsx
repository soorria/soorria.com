import { Accessor, createMemo, ValidComponent, VoidComponent } from 'solid-js'

import Fragment from '~/components/Fragment'
import { baseComponents } from '~/components/mdx/base'

const withCommonComponents =
  (Component: VoidComponent<{ components: Record<string, ValidComponent> }>) => () =>
    <Component components={baseComponents} />

export const useMdxComponent = (
  code?: Accessor<string | null | undefined>
): Accessor<VoidComponent> => {
  return createMemo(() => {
    const c = code?.()
    if (!c) return Fragment
    // return withCommonComponents(getMDXComponent(c))
    return () => void 0
  })
}

export const useMdxComponents = (code?: string[] | null | undefined): Accessor<VoidComponent[]> => {
  return createMemo(
    () =>
      code?.map(_singleComponentCode =>
        // withCommonComponents(getMDXComponent(singleComponentCode))
        withCommonComponents(() => void 0)
      ) ?? []
  )
}
