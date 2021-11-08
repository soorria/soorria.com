import Container from './Container'

interface PostLayoutProps {
  title: string
}

export const PostHeading: React.FC = ({ children }) => {
  return (
    <h1 className="mt-0 mb-10 text-4xl font-bold text-center sm:mt-8 sm:text-6xl font-display text-drac-pink">
      {children}
    </h1>
  )
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
