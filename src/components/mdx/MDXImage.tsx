import { ComponentProps, createEffect, DEV, VoidComponent } from 'solid-js'

const MDXImage: VoidComponent<ComponentProps<'img'>> = props => {
  if (DEV) {
    createEffect(() => {
      if (!props.alt) throw new Error('MDXImage requires an alt attribute')
    })
  }

  return (
    <div class="-mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...props} />
    </div>
  )
}

export default MDXImage
