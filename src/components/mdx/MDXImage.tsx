import { ComponentProps, VoidComponent } from 'solid-js'

const MDXImage: VoidComponent<ComponentProps<'img'>> = props => {
  return (
    <div class="-mx-2 md:-mx-6">
      <img {...props} />
    </div>
  )
}

export default MDXImage
