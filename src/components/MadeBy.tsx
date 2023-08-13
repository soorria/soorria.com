import Link from 'next/link'
import { PUBLIC_URL } from '~/constants'
import { HeartIcon } from './icons'
import cx from '~/utils/cx'

interface MadeByProps {
  asLink?: boolean | 'external'
  ping?: 'always' | 'hover'
}

const MadeBy: React.FC<MadeByProps> = props => {
  const classes = {
    ping: props.ping === 'hover' ? 'group-hover:animate-ping' : 'animate-ping',
    text: props.asLink ? 'group-hover:underline' : '',
  }
  const content = (
    <>
      <span className={classes.text}>Made with</span>{' '}
      <span className="relative inline-block h-5 w-5 align-middle">
        <HeartIcon className="absolute inset-0 fill-current text-drac-purple" />
        <HeartIcon
          className={cx('absolute inset-0 fill-current text-drac-red', classes.ping)}
          style={{ animationDelay: '150ms' }}
        />
        <HeartIcon className={cx('absolute inset-0 fill-current text-drac-pink', classes.ping)} />
      </span>{' '}
      <span className={classes.text}>
        by <span>Soorria</span>
      </span>
    </>
  )

  const commonProps = {
    className: 'focus-ring group block rounded text-center',
    'aria-label': 'Made with love by Soorria',
  }

  if (props.asLink) {
    return (
      <Link href={props.asLink === 'external' ? PUBLIC_URL : '/'} {...commonProps}>
        {content}
      </Link>
    )
  }

  return <p {...commonProps}>{content}</p>
}

export default MadeBy
