import NeedsJs from '~/components/NeedsJs'
import PostLayout from '~/components/posts/PostLayout'
import { PUBLIC_URL } from '~/constants'
import { getOgImage } from '~/utils/og'
import { Settings } from './secrets-client'

const title = 'Secret Stuff'
const description = 'Shhh... 🤫🤐'
const url = `${PUBLIC_URL}/secrets`

export const metadata = {
  title,
  description,
  alternates: { canonical: url },

  openGraph: {
    url,
    title,
    description,
    images: [getOgImage({ title: 'Nothing to see here...', subtitle: 'soorria.com' })],
  },
}

const SecretsPage: React.FC = () => {
  return (
    <PostLayout title={title}>
      <NeedsJs fallback={<p>This page needs JavaScript!</p>}>
        <Settings />
      </NeedsJs>
    </PostLayout>
  )
}

export default SecretsPage
