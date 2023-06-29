import type { ScrollVar } from '~/utils/use-scroll-css-var'
import type { IconComponent } from '../icons'
import { SpinningIconDividerClient } from './SpinningIconDivider.client'

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
