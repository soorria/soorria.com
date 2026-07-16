import cx from '~/utils/cx'
import type { PropsWithChildren, ReactNode } from 'react'

type Variant = 'success' | 'info' | 'warning'

type NoteProps = PropsWithChildren<{
  variant?: Variant
  title?: ReactNode
  id?: string
}>

const VARIANT_COLORS: Record<Variant, string> = {
  success: 'bg-drac-green/10 border-drac-green text-drac-green',
  info: 'bg-drac-cyan/10 border-drac-cyan text-drac-cyan',
  warning: 'bg-drac-orange/10 border-drac-orange text-drac-orange',
}

const VARIANT_TITLE: Partial<Record<Variant, ReactNode>> = {
  info: 'Info',
  warning: 'Warning',
}

const Note: React.FC<NoteProps> = ({ children, variant = 'info', title: titleProp, id }) => {
  const title = titleProp ?? VARIANT_TITLE[variant]
  return (
    <div className="-mx-0.5" id={id}>
      <div
        className={cx(
          'note -mx-2 my-7 rounded-xl border-x-2  px-4 py-7 md:-mx-6 md:px-10',
          VARIANT_COLORS[variant]
        )}
      >
        {title && <p className="font-display text-lg font-bold">{title}</p>}
        {children}
      </div>
    </div>
  )
}

export default Note
