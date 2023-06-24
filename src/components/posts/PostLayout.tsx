import { PropsWithChildren } from 'react'
import Container from '../Container'

type PostLayoutProps = PropsWithChildren<{
  title: string
}>

export const PostHeading: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1
      className="mb-20 mt-0 text-center text-5xl !leading-tight text-drac-pink sm:mt-8 sm:text-6xl md:text-7xl"
      style={{
        overflowWrap: 'break-word',
        // @ts-expect-error types haven't caught up yet
        textWrap: 'balance',
      }}
    >
      {children}
    </h1>
  )
}

export const PostBottomSection: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto !mt-24 max-w-xs space-y-8 text-center text-sm">{children}</div>
}

const PostLayout: React.FC<PostLayoutProps> = ({ title, children }) => {
  return (
    <Container>
      <article className="slide-in space-y-12 pb-16 pt-8">
        <PostHeading>{title}</PostHeading>
        {children}
      </article>
    </Container>
  )
}

export default PostLayout
