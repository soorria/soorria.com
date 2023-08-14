import MadeBy from '~/components/MadeBy'
import MagicSprinklesPage from './page.client'
import { getOgImage } from '~/utils/og'

const url = '/installations/magic-sprinkles'
const title = 'Magic Sprinkles'
const description = 'A fun and addictive little interactive animation'

const ogImage = getOgImage({
  title: 'magic sprinkles',
  subtitle: description,
  bottomText: 'soorria.com/art',
})

export const metadata = {
  title,
  description,

  alternates: {
    canonical: url,
  },

  openGraph: {
    type: 'article',
    url,
    title,
    description,
    images: [ogImage],
  },

  twitter: {
    title,
    description,
    images: [ogImage],
  },
}

const MagicSprinklesServerPage = () => {
  return (
    <MagicSprinklesPage>
      <div
        className="slide-in-direct pointer-events-none fixed inset-x-0 bottom-4 flex justify-center text-sm"
        style={{ '--initial-step': '5' }}
      >
        <div className="group pointer-events-auto rounded px-4 py-2 opacity-50 transition hover:bg-drac-base-dark/75 hover:opacity-100">
          <MadeBy asLink ping="hover" />
        </div>
      </div>
    </MagicSprinklesPage>
  )
}

export default MagicSprinklesServerPage
