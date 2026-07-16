'use client'

import { type ReactNode } from 'react'
import { useScrollCssVar, type ScrollVar } from '~/utils/use-scroll-css-var'
import type { IconComponent } from '../icons'

export const SpinningIconDividerClient: React.FC<{ icon: ReactNode; scrollVar: ScrollVar }> = ({
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

export const SpinningIconDivider = ({
  icon: Icon,
  scrollVar,
}: {
  icon: IconComponent
  scrollVar: ScrollVar
}) => {
  return (
    <SpinningIconDividerClient
      icon={
        <Icon
          className="inline-block h-6 w-6 transition-transform ease-linear"
          style={{
            transform: `rotate(calc(var(${scrollVar}) * 2 * 360deg))`,
          }}
        />
      }
      scrollVar={scrollVar}
    />
  )
}
