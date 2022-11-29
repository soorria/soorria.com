import Container from '../Container'

interface PostLayoutProps {
  title: string
}

export const PostHeading: React.FC = ({ children }) => {
  return (
    <h1
      className="mt-0 mb-20 text-center text-5xl !leading-tight text-drac-pink sm:mt-8 sm:text-6xl md:text-7xl"
      style={{ overflowWrap: 'break-word' }}
    >
      {children}
    </h1>
  )
}

export const PostBottomSection: React.FC = ({ children }) => {
  return <div className="mx-auto mt-24 max-w-xs space-y-8 text-center text-sm">{children}</div>
}

const PostLayout: React.FC<PostLayoutProps> = ({ title, children }) => {
  return (
    <Container>
      <article className="space-y-12 pt-8 pb-16">
        <PostHeading>{title}</PostHeading>
        {children}
      </article>
    </Container>
  )
}

export default PostLayout
