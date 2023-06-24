'use client'

import { ReactNode } from 'react'
import { useScrollCssVar, ScrollVar } from '~/utils/use-scroll-css-var'

export const SpinningIconDivider: React.FC<{ icon: ReactNode; scrollVar: ScrollVar }> = ({
  icon,
  scrollVar,
}) => {
  useScrollCssVar(scrollVar)

  const line = (
    <div role="presentation" className="flex items-center opacity-50">
      <div className="h-px flex-1 bg-current" />
    </div>
  )

  return (
    <div
      className="grid gap-4 px-4 text-center text-drac-highlight"
      role="presentation"
      aria-hidden="true"
      style={{ gridTemplateColumns: '1fr auto 1fr' }}
    >
      {line}

      {icon}
      {line}
    </div>
  )
}
