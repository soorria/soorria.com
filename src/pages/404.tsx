import Container from '@/components/Container'
import { PostHeading } from '@/components/PostLayout'
import Link from 'next/link'

const NotFound: React.FC = () => {
  return (
    <Container>
      <div className="py-8">
        <PostHeading>You&apos;re Lost</PostHeading>
        <Link href="/" passHref>
          <a className="block max-w-xs mx-auto my-8 text-center group">
            Click <span className="group-hover:underline text-drac-pink">here</span> to go home.
          </a>
        </Link>
      </div>
    </Container>
  )
}

export default NotFound
