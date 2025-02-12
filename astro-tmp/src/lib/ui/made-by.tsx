import { HeartIcon } from './icons'
import { cx } from '../utils/styles'
import { PUBLIC_URL } from '../constants/site'

interface MadeByProps {
  asLink?: boolean | 'external'
  ping?: 'always' | 'hover'
}

const MadeBy: React.FC<MadeByProps> = (props) => {
  const classes = {
    ping:
      props.ping === 'hover' ? 'group-hover:supports-hover:animate-ping-slow' : 'animate-ping-slow',
    text: props.asLink ? 'group-hover:supports-hover:underline' : '',
  }

  const content = (
    <>
      <span className={classes.text}>Made with</span>{' '}
      <span className="relative inline-block h-5 w-5 align-middle">
        <HeartIcon className="text-drac-purple absolute inset-0 fill-current" />
        <HeartIcon
          className={cx('text-drac-red absolute inset-0 fill-current', classes.ping)}
          style={{ animationDelay: '150ms' }}
        />
        <HeartIcon className={cx('text-drac-pink absolute inset-0 fill-current', classes.ping)} />
      </span>{' '}
      <span className={classes.text}>
        by <span>Soorria</span>
      </span>
    </>
  )

  const commonProps = {
    className: 'focus-ring group block rounded-sm text-center',
    'aria-label': 'Made with love by Soorria',
  }

  if (props.asLink) {
    return (
      <a href={props.asLink === 'external' ? PUBLIC_URL : '/'} {...commonProps}>
        {content}
      </a>
    )
  }

  return <p {...commonProps}>{content}</p>
}

export default MadeBy
