import type { PropsWithChildren, ReactNode } from 'react'
import Container from '../Container'
import { type Pattern, availablePatterns } from '../landing/hero-patterns'
import cx from '~/utils/cx'
import { heroBackdropClassname } from '../landing/Hero'

type PostLayoutProps = PropsWithChildren<{
  title: string
  description?: ReactNode
  patterns?: [Pattern, ...Pattern[]]
  backdrop?: ReactNode
  hidePatternsWhenJs?: boolean
}>

export const PostHeading: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1
      className="mb-20 mt-0 text-pretty text-center text-5xl !leading-tight text-drac-pink [--heading-padding:1rem] sm:mt-8 sm:text-6xl md:text-7xl lg:mb-16 lg:text-8xl lg:[--heading-padding:8rem]"
      style={{
        overflowWrap: 'break-word',
        '--width': 'calc(100vw - var(--heading-padding))',
        width: 'var(--width)',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: 'calc(var(--width) / -2)',
        marginRight: 'calc(var(--width) / -2)',
        // @ts-expect-error textWrap is not in the CSS typings
        textWrap: 'balance',
      }}
    >
      {typeof children === 'string'
        ? children
            .split(' ')
            .map(word =>
              word
                .replace(/[a-z][A-Z]/g, m => `${m[0]} ${m[1]}`)
                .split(' ')
                .flatMap((chunk, i) => (i === 0 ? [chunk] : [<wbr key={i} />, chunk]))
            )
            .map((word, i) => {
              if (i === 0) return word
              return [' ', word]
            })
        : children}
    </h1>
  )
}

export const PostBottomSection: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto !mt-24 max-w-xs space-y-8 text-center text-sm">{children}</div>
}

export const PostDescription = ({ children }: { children: ReactNode }) => {
  return <p className="mb-12 mt-6 text-pretty text-center text-lg">{children}</p>
}

const PostLayout: React.FC<PostLayoutProps> = ({
  title,
  children,
  description,
  patterns,
  backdrop,
  hidePatternsWhenJs,
}) => {
  const meta = (
    <>
      <PostHeading>{title}</PostHeading>
      {description && <PostDescription>{description}</PostDescription>}
    </>
  )

  return (
    <Container>
      <article className="slide-in space-y-12 pb-16 pt-8">
        {patterns ? (
          <div
            className={cx('slide-in-direct isolate overflow-visible', heroBackdropClassname)}
            aria-hidden
          >
            {patterns.map((pattern, i) => (
              <div
                className={cx(
                  'hero-bg absolute inset-0 -bottom-16 -top-8 -z-10',
                  hidePatternsWhenJs && 'no-js-block hidden'
                )}
                style={{ '--pattern': availablePatterns[pattern] ?? '' }}
                key={i}
              />
            ))}
            {backdrop}
            {meta}
          </div>
        ) : (
          meta
        )}
        {children}
      </article>
    </Container>
  )
}

export default PostLayout
