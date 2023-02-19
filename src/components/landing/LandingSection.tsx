import { JSXElement, ParentComponent } from 'solid-js'

import CustomLink from '../CustomLink'

type LandingSectionProps = {
  title: JSXElement
  id?: string
}

const LandingSection: ParentComponent<LandingSectionProps> = props => {
  return (
    <section id={props.id} class="mt-8 mb-24 scroll-mt-4">
      <h3 class="mb-8 text-4xl font-bold">
        {props.title}
        <CustomLink href={`#${props.id}`} class="heading-anchor" aria-hidden="true" tabIndex={-1} />
      </h3>
      {props.children}
    </section>
  )
}

export default LandingSection
