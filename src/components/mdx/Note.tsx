import cx from '~/utils/cx'
import { JSXElement, ParentComponent } from 'solid-js'

type Variant = 'success' | 'info' | 'warning'

type NoteProps = {
  variant?: Variant
  title?: JSXElement
}

const VARIANT_COLORS: Record<Variant, string> = {
  success: 'bg-drac-green border-drac-green text-drac-green',
  info: 'bg-drac-cyan border-drac-cyan text-drac-cyan',
  warning: 'bg-drac-orange border-drac-orange text-drac-orange',
}

const VARIANT_TITLE: Partial<Record<Variant, JSXElement>> = {
  info: 'Info',
  warning: 'Warning',
}

const Note: ParentComponent<NoteProps> = props => {
  const variant = () => props.variant || 'info'
  const title = () => props.title || VARIANT_TITLE[variant()]
  return (
    <div class="-mx-0.5">
      <div
        class={cx(
          'note -mx-2 my-7 rounded-xl border-x-2 bg-opacity-10 px-4 py-7 md:-mx-6 md:px-10',
          VARIANT_COLORS[variant()]
        )}
      >
        {title() && <p class="font-display text-lg font-bold">{title()}</p>}
        {props.children}
      </div>
    </div>
  )
}

export default Note
