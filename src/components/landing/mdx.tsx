import { minimalComponents } from '~/components/mdx/minimal'
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client'
import React, { Fragment, useMemo } from 'react'

// eslint-disable-next-line react/display-name
const withCommonComponents = (Component: React.FC<MDXContentProps>) => () =>
  <Component components={minimalComponents} />

export const useMdxComponent = (code?: string | null | undefined): React.FC => {
  return useMemo(() => {
    if (!code) return Fragment
    return withCommonComponents(getMDXComponent(code))
  }, [code])
}

export const useMdxComponents = (code?: string[] | null | undefined): React.FC[] => {
  return useMemo(
    () =>
      code?.map(singleComponentCode =>
        withCommonComponents(getMDXComponent(singleComponentCode))
      ) ?? [],
    [code]
  )
}
