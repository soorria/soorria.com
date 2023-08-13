import MadeBy from '~/components/MadeBy'
import MagicSprinklesPage from './page.client'
import { getOgImage } from '~/utils/og'

export const metadata = {
  title: 'Magic Sprinkles',
  description: 'A fun and addictive little interactive animation',

  openGraph: {
    type: 'article',
    images: [
      getOgImage({
        title: 'magic sprinkles',
        subtitle: 'A fun and addictive little interactive animation',
        bottomText: 'soorria.com/art',
      }),
    ],
  },
}

const MagicSprinklesServerPage = () => {
  return (
    <MagicSprinklesPage>
      <div
        className="slide-in-direct pointer-events-none absolute inset-x-0 bottom-4 flex justify-center text-sm"
        style={{ '--initial-step': '4' }}
      >
        <div className="group pointer-events-auto rounded px-4 py-2 opacity-50 transition hover:bg-drac-base-dark/75 hover:opacity-100">
          <MadeBy asLink ping="hover" />
        </div>
      </div>
    </MagicSprinklesPage>
  )
}

export default MagicSprinklesServerPage
