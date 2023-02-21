import ErrorPage from './error'

export default function NotFound() {
  return <ErrorPage statusCode={404} statusText={"You're lost!"} tryAgain={false} />
}
