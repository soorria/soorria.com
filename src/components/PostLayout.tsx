import Container from './Container'

interface PostLayoutProps {
  title: string
}

const PostLayout: React.FC<PostLayoutProps> = ({ title, children }) => {
  return (
    <Container>
      <article className="py-8">
        <h1 className="mb-8 text-4xl font-bold text-center sm:text-5xl font-display text-drac-pink">
          {title}
        </h1>
        {children}
      </article>
    </Container>
  )
}

export default PostLayout
