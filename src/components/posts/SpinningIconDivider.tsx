import { VoidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { useScrollCssVar } from '~/utils/use-scroll-css-var'

import type { IconComponent } from '../icons'

export const SpinningIconDivider: VoidComponent<{
  icon: IconComponent
  scrollVar: string
}> = props => {
  useScrollCssVar(() => props.scrollVar)

  const line = () => (
    <div role="presentation" class="flex items-center opacity-50">
      <div class="h-px flex-1 bg-current" />
    </div>
  )

  return (
    <div
      class="grid gap-4 pb-6 text-center text-drac-highlight"
      role="presentation"
      aria-hidden="true"
      style={{ 'grid-template-columns': '1fr auto 1fr' }}
    >
      {line()}
      <Dynamic
        component={props.icon}
        class="inline-block h-6 w-6 transition-transform ease-linear"
        style={{
          transform: `rotate(calc(var(${props.scrollVar}) * 2 * 360deg))`,
        }}
      />
      {line()}
    </div>
  )
}
