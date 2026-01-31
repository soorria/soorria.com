import MainLayout from './(main)/layout'
import ErrorBase from './error-base'

const NotFound = () => (
  <MainLayout>
    <ErrorBase error="You're lost" statusCode={404} tryAgain={false} />
  </MainLayout>
)

export default NotFound
