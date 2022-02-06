import { baseComponents } from '@/components/mdx/base'
import { getMDXComponent } from 'mdx-bundler/client'
import React, { Fragment, useMemo } from 'react'

export const useMdxComponent = (code?: string | null | undefined): React.FC => {
  return useMemo(() => {
    if (!code) return Fragment
    const Component = getMDXComponent(code)

    // eslint-disable-next-line react/display-name
    return () => <Component components={baseComponents as any} />
  }, [code])
}
