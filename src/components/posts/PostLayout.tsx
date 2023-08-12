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
      className="mb-20 mt-0 text-center text-5xl !leading-tight text-drac-pink text-balance sm:mt-8 sm:text-6xl md:text-7xl"
      style={{
        overflowWrap: 'break-word',
      }}
    >
      {children}
    </h1>
  )
}

export const PostBottomSection: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto !mt-24 max-w-xs space-y-8 text-center text-sm">{children}</div>
}

export const PostDescription = ({ children }: { children: ReactNode }) => {
  return <p className="mb-12 mt-6 text-center text-lg text-balance">{children}</p>
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
