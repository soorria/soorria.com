import cx from '@/utils/cx'

type Variant = 'success' | 'info' | 'warning'

interface NoteProps {
  variant?: Variant
}

const VARIANT_COLORS: Record<Variant, string> = {
  success: 'bg-drac-green border-drac-green text-drac-green',
  info: 'bg-drac-cyan border-drac-cyan text-drac-cyan',
  warning: 'bg-drac-orange border-drac-orange text-drac-orange',
}

const Note: React.FC<NoteProps> = ({ children, variant = 'info' }) => {
  return (
    <div className="-mx-0.5">
      <div
        className={cx(
          'note -mx-2 my-7 rounded-xl border-x-2 bg-opacity-10 px-4 py-7 md:-mx-6 md:px-10',
          VARIANT_COLORS[variant]
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Note
