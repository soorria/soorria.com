import { useScrollCssVar } from '~/utils/use-scroll-css-var'
import type { IconComponent } from '../icons'

export const SpinningIconDivider: React.FC<{ icon: IconComponent; scrollVar: string }> = ({
  icon: Icon,
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
      className="grid gap-4 pb-6 text-center text-drac-highlight"
      role="presentation"
      aria-hidden="true"
      style={{ gridTemplateColumns: '1fr auto 1fr' }}
    >
      {line}
      <Icon
        className="inline-block h-6 w-6 transition-transform ease-linear"
        style={{
          transform: `rotate(calc(var(${scrollVar}) * 2 * 360deg))`,
        }}
      />
      {line}
    </div>
  )
}
