import { Fragment, type CSSProperties, type HTMLAttributes, type PropsWithChildren } from 'react'

type BleedAmount = string | number
type BleedProps = {
  amount?: BleedAmount
  contained?: boolean
} & HTMLAttributes<HTMLDivElement>

const getStyle = (bleedAmount: string | number): CSSProperties => {
  if (bleedAmount === 'full') {
    return {
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
    }
  }

  if (typeof bleedAmount === 'number') {
    bleedAmount = `${bleedAmount / 4}rem`
  }

  return {
    marginLeft: '-' + bleedAmount,
    marginRight: '-' + bleedAmount,
    paddingLeft: bleedAmount,
    paddingRight: bleedAmount,
  }
}

const ProseContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="mx-auto max-w-[65ch]">{children}</div>
)

const Bleed: React.FC<BleedProps> = ({ amount = 'full', children, style, contained, ...rest }) => {
  const Wrapper = contained ? ProseContainer : Fragment
  return (
    <div style={{ ...getStyle(amount), ...style }} {...rest}>
      <Wrapper>{children}</Wrapper>
    </div>
  )
}

export default Bleed
