// import { NextSeo } from 'next-seo'
import { VoidComponent } from 'solid-js'

import PostLayout from '~/components/layout/PostLayout'
import NeedsJs from '~/components/NeedsJs'
import { PUBLIC_URL } from '~/constants'
import { Seo } from '~/lib/seo'
import { getOgImage } from '~/utils/og'
import { useLocalStorage } from '~/utils/use-local-storage'

const title = 'Secret Stuff'
const description = 'Shhh... 🤫🤐'
const url = `${PUBLIC_URL}/secrets`

const Settings: VoidComponent = () => {
  const [allowAnalytics, setAllowAnalytics] = useLocalStorage<'' | true>('plausible_ignore', '')

  return (
    <div class="mx-auto max-w-xs space-y-6">
      <div class="flex items-center justify-center space-x-2 text-lg">
        <input
          type="checkbox"
          id="allow-analytics"
          name="allow-analytics"
          class="block h-4 w-4"
          checked={!allowAnalytics}
          onChange={e => setAllowAnalytics(e.currentTarget.checked ? '' : true)}
        />
        <label for="allow-analytics" class="block">
          Allow analytics with plausible?
        </label>
      </div>
    </div>
  )
}

const SecretsPage: VoidComponent = () => {
  return (
    <PostLayout title={title}>
      <Seo
        title={title}
        // noindex
        openGraph={{ url, description, images: [getOgImage(title, 'soorria.com')] }}
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
