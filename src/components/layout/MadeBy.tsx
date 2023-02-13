import { VoidComponent } from 'solid-js'
import { PUBLIC_URL } from '~/constants'
import { HeartIcon } from '~/components/icons'
import { A } from 'solid-start'

const MadeBy: VoidComponent = () => {
  return (
    <A
      href={PUBLIC_URL}
      class="focus-ring group block rounded text-center"
      aria-label="Made with love by Soorria"
    >
      Made with{' '}
      <span class="relative inline-block h-5 w-5 align-middle">
        <HeartIcon class="absolute inset-0 fill-current text-drac-purple" />
        <HeartIcon class="absolute inset-0 fill-current text-drac-pink group-hover:animate-ping" />
      </span>{' '}
      by <span class="hover:underline">Soorria</span>
    </A>
  )
}

export default MadeBy
