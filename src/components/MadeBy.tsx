import { HeartIcon } from './icons'

interface MadeByProps {}

const MadeBy: React.FC<MadeByProps> = () => {
  return (
    <div className="group text-center">
      Made with{' '}
      <span className="relative inline-block h-5 w-5 align-middle">
        <HeartIcon className="absolute inset-0 fill-current text-drac-purple" />
        <HeartIcon className="absolute inset-0 fill-current text-drac-pink group-hover:animate-ping" />
      </span>{' '}
      by Soorria
    </div>
  )
}

export default MadeBy
