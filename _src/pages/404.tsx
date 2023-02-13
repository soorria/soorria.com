import ErrorPage from './_error'

const NotFound: React.FC = () => {
  return <ErrorPage statusText="You're Lost" tryAgain={false} />
}

export default NotFound
