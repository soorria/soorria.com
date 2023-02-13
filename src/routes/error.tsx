import { VoidComponent } from 'solid-js'
import { A, useLocation } from 'solid-start'
import MainLayout from '~/components/layout/MainLayout'
import { PostHeading } from '~/components/layout/PostLayout'

interface ErrorPageProps {
  statusCode?: number
  statusText?: string
  tryAgain?: boolean
}

const DEFAULT_MESSAGE = 'I messed up :('

const ErrorPage: VoidComponent<ErrorPageProps> = props => {
  const location = useLocation()
  return (
    <MainLayout>
      <PostHeading>
        {props.statusCode ? <span>{props.statusCode} - </span> : null}
        {props.statusText || DEFAULT_MESSAGE}
      </PostHeading>
      {props.tryAgain && (
        <>
          <A href={location.pathname} class="group mx-auto my-8 block max-w-xs text-center text-lg">
            Click <span class="text-drac-pink group-hover:underline">here</span> to try again.
          </A>
          <p class="text-center italic">or</p>
        </>
      )}
      <A href="/" class="group mx-auto my-8 block max-w-xs text-center text-lg">
        Click <span class="text-drac-pink group-hover:underline">here</span> to go home.
      </A>
    </MainLayout>
  )
}

export default ErrorPage
