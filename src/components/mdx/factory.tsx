'use client'

import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client'
import { Fragment, useMemo } from 'react'

export const createMdxUtils = (components: MDXContentProps['components']) => {
  // eslint-disable-next-line react/display-name
  const withCommonComponents = (Component: React.FC<MDXContentProps>) => () =>
    <Component components={components} />

  const useMdxComponent = (code?: string | null | undefined): React.FC => {
    return useMemo(() => {
      if (!code) return Fragment
      return withCommonComponents(getMDXComponent(code))
    }, [code])
  }

  const useMdxComponents = (code?: string[] | null | undefined): React.FC[] => {
    return useMemo(
      () =>
        code?.map(singleComponentCode =>
          withCommonComponents(getMDXComponent(singleComponentCode))
        ) ?? [],
      [code]
    )
  }

  const Mdx = ({ code }: { code: string | null | undefined }) => {
    const Component = useMdxComponent(code)
    return <Component />
  }

  return {
    useMdxComponent,
    useMdxComponents,
    Mdx,
  }
}
