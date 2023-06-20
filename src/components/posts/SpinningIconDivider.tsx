import type { ScrollVar } from '~/utils/use-scroll-css-var'
import type { IconComponent } from '../icons'

export const renderIcon = (Icon: IconComponent, scrollVar: ScrollVar) => (
  <Icon
    className="inline-block h-6 w-6 transition-transform ease-linear"
    style={{
      transform: `rotate(calc(var(${scrollVar}) * 2 * 360deg))`,
    }}
  />
)

export { SpinningIconDivider } from './SpinningIconDivider.client'
