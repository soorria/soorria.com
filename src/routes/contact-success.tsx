import { VoidComponent } from 'solid-js'

import ErrorPage from './error'

const ContactSuccessPage: VoidComponent = () => {
  return <ErrorPage statusText="Thanks!" />
}

export default ContactSuccessPage
