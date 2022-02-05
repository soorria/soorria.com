import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { STATUS_CODES } from 'http'

import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'

interface ErrorPageProps {
  statusCode?: number
  statusText?: string
}

const DEFAULT_MESSAGE = 'I messed up :('

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, statusText }) => {
  return (
    <MainLayout>
      <PostHeading>
        {statusCode ? <span>{statusCode} - </span> : null}
        {statusText || DEFAULT_MESSAGE}
      </PostHeading>
      <Link href="/" passHref>
        <a className="group mx-auto my-8 block max-w-xs text-center">
          Click <span className="text-drac-pink group-hover:underline">here</span> to go home.
        </a>
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
