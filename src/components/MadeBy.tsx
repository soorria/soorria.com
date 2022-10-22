import Link from 'next/link'
import { PUBLIC_URL } from '~/constants'
import { HeartIcon } from './icons'

interface MadeByProps {}

const MadeBy: React.FC<MadeByProps> = () => {
  return (
    <Link href={PUBLIC_URL}>
      <a
        className="focus-ring group block rounded text-center"
        aria-label="Made with love by Soorria"
      >
        Made with{' '}
        <span className="relative inline-block h-5 w-5 align-middle">
          <HeartIcon className="absolute inset-0 fill-current text-drac-purple" />
          <HeartIcon className="absolute inset-0 fill-current text-drac-pink group-hover:animate-ping" />
        </span>{' '}
        by <span className="hover:underline">Soorria</span>
      </a>
    </Link>
  )
}

export default MadeBy
