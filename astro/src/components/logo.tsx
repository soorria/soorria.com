import type { SVGProps } from 'react'
import cx from '~/utils/cx'

const SIZES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  auto: '',
}

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: keyof typeof SIZES
}

const Logo: React.FC<LogoProps> = ({ size = 'auto', className, ...rest }) => {
  return (
    <svg {...rest} className={cx(SIZES[size], className)} viewBox="0 0 24 24">
      <mask
        id="a"
        // eslint doesn't think it's legit :(
        // eslint-disable-next-line react/no-unknown-property
        mask-type="alpha"
        width="24"
        height="24"
        x="0"
        y="0"
      >
        <rect width="24" height="24" fill="#fff" rx="3" />
      </mask>
      <g mask="url(#a)">
        <path className="fill-current text-drac-purple" d="M0 0h24v24H0z" />
        <path className="fill-current text-drac-pink" d="M0 24h24V0C-8 0 32 24 0 24" />
      </g>
    </svg>
  )
}

export default Logo
