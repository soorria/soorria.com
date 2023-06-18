import Link from 'next/link'
import MainLayout from '~/components/MainLayout'
import { PostHeading } from '~/components/posts/PostLayout'

const DEFAULT_MESSAGE = 'I messed up :('

const ErrorBase = ({
  error,
  reset,
  tryAgain = true,
  statusCode = 500,
}: {
  error: Error | string
  reset?: () => void
  tryAgain?: boolean
  statusCode?: number
}) => {
  return (
    <MainLayout>
      <PostHeading>
        {statusCode ? <span>{statusCode} - </span> : null}
        {(error instanceof Error ? error.message : error) || DEFAULT_MESSAGE}
      </PostHeading>
      {tryAgain && (
        <>
          <button onClick={reset} className="group mx-auto my-8 block max-w-xs text-center text-lg">
            Click <span className="text-drac-pink group-hover:underline">here</span> to try again.
          </button>
          <p className="text-center italic">or</p>
        </>
      )}
      <Link href="/" passHref className="group mx-auto my-8 block max-w-xs text-center text-lg">
        Click <span className="text-drac-pink group-hover:underline">here</span> to go home.
      </Link>
    </MainLayout>
  )
}

export default ErrorBase
