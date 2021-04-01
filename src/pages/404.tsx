import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'
import Link from 'next/link'

const NotFound: React.FC = () => {
  return (
    <MainLayout>
      <PostHeading>You&apos;re Lost</PostHeading>
      <Link href="/" passHref>
        <a className="block max-w-xs mx-auto my-8 text-center group">
          Click <span className="group-hover:underline text-drac-pink">here</span> to go home.
        </a>
      </Link>
    </MainLayout>
  )
}

export default NotFound
