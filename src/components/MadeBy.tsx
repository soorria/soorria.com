import { HeartIcon } from './icons'

interface MadeByProps {}

const MadeBy: React.FC<MadeByProps> = () => {
  return (
    <div className="group text-center">
      Made with{' '}
      <span className="relative inline-block h-5 w-5 align-middle">
        <HeartIcon className="absolute inset-0 fill-current text-drac-pink" />
        <HeartIcon className="absolute inset-0 fill-current text-drac-purple group-hover:animate-ping" />
      </span>{' '}
      by Soorria
    </div>
  )
}

export default MadeBy
