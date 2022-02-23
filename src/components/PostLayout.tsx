import Container from './Container'

interface PostLayoutProps {
  title: string
}

export const PostHeading: React.FC = ({ children }) => {
  return (
    <h1 className="mt-0 mb-20 text-center text-5xl text-drac-pink sm:mt-8 sm:text-6xl">
      {children}
    </h1>
  )
}

export const PostBottomSection: React.FC = ({ children }) => {
  return <div className="mx-auto my-24 max-w-xs text-center text-sm">{children}</div>
}

const PostLayout: React.FC<PostLayoutProps> = ({ title, children }) => {
  return (
    <Container>
      <article className="pt-8 pb-16">
        <PostHeading>{title}</PostHeading>
        {children}
      </article>
    </Container>
  )
}

export default PostLayout
