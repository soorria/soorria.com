import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { STATUS_CODES } from 'http'

import MainLayout from '~/components/MainLayout'
import { PostHeading } from '~/components/posts/PostLayout'
import { useRouter } from 'next/router'

interface ErrorPageProps {
  statusCode?: number
  statusText?: string
  tryAgain?: boolean
}

const DEFAULT_MESSAGE = 'I messed up :('

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, statusText, tryAgain = true }) => {
  const router = useRouter()
  return (
    <MainLayout>
      <PostHeading>
        {statusCode ? <span>{statusCode} - </span> : null}
        {statusText || DEFAULT_MESSAGE}
      </PostHeading>
      {tryAgain && (
        <>
          <Link
            href={router.pathname}
            passHref
            className="group mx-auto my-8 block max-w-xs text-center text-lg"
          >
            Click <span className="text-drac-pink group-hover:underline">here</span> to try again.
          </Link>
          <p className="text-center italic">or</p>
        </>
      )}
      <Link href="/" passHref className="group mx-auto my-8 block max-w-xs text-center text-lg">
        Click <span className="text-drac-pink group-hover:underline">here</span> to go home.
      </Link>
    </MainLayout>
  )
}

export default ErrorPage

export const getServerSideProps: GetServerSideProps<ErrorPageProps> = async ({ res, query }) => {
  const statusCode =
    typeof query.status === 'string' ? parseInt(query.status) : res ? res.statusCode : 500

  const props = {
    statusCode,
    statusText: STATUS_CODES[statusCode] || DEFAULT_MESSAGE,
  }

  return {
    props,
  }
}
