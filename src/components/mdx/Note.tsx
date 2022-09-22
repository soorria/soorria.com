import cx from '@/utils/cx'

type Variant = 'success' | 'info'

interface NoteProps {
  variant?: Variant
}

const VARIANT_COLORS: Record<Variant, string> = {
  success: 'bg-drac-green border-drac-green text-drac-green',
  info: 'bg-drac-cyan border-drac-cyan',
}

const Note: React.FC<NoteProps> = ({ children, variant = 'info' }) => {
  return (
    <div className="-mx-0.5">
      <div
        className={cx(
          '-mx-2 my-7 rounded-xl border-x-2 bg-opacity-10 px-2 py-1 md:-mx-6 md:px-6',
          VARIANT_COLORS[variant]
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Note
