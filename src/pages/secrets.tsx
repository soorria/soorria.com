import NeedsJs from '@/components/NeedsJs'
import PostLayout from '@/components/PostLayout'
import { getOgImage } from '@/utils/og'
import { useLocalStorage } from '@/utils/use-local-storage'
import { NextSeo } from 'next-seo'

const title = 'Secret Stuff'
const description = 'Shhh... 🤫🤐'
const url = 'https://mooth.tech/secrets'

const Settings: React.FC = () => {
  const [allowAnalytics, setAllowAnalytics] = useLocalStorage<'' | true>('plausible_ignore', '')

  return (
    <div className="mx-auto max-w-xs space-y-6">
      <div className="flex items-center justify-center space-x-2 text-lg">
        <input
          type="checkbox"
          id="allow-analytics"
          name="allow-analytics"
          className="block h-4 w-4"
          checked={!allowAnalytics}
          onChange={e => setAllowAnalytics(e.target.checked ? '' : true)}
        />
        <label htmlFor="allow-analytics" className="block">
          Allow analytics with plausible?
        </label>
      </div>
    </div>
  )
}

const SecretsPage: React.FC = () => {
  return (
    <PostLayout title={title}>
      <NextSeo
        title={title}
        noindex
        openGraph={{ url, description, images: [getOgImage(title)] }}
        canonical={url}
        description={description}
      />
      <NeedsJs fallback={<p>This page needs JavaScript!</p>}>
        <Settings />
      </NeedsJs>
    </PostLayout>
  )
}

export default SecretsPage
