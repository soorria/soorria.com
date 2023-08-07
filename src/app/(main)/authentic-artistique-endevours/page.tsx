import CustomLink from '~/components/CustomLink'
import MDXImage from '~/components/mdx/MDXImage'
import PostLayout from '~/components/posts/PostLayout'
import ProseWrapper from '~/components/posts/ProseWrapper'
import { artImages } from './images'
import { Fragment, type ReactNode } from 'react'
import { paramCase } from 'change-case'
import type { StaticImageData } from 'next/image'
import { getOgImage } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'

const url = `${PUBLIC_URL}/art`
const title = 'Authentic Artistique Endevours'
const description = 'Welcome to the world of the authentic artistique endevours of Soorria Saruva.'
export const metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    url,
    title,
    type: 'website',
    description,
    images: [getOgImage('Authentic Artistique Endevours', 'soorria.com/art')],
  },
}

const art: Array<{
  src: StaticImageData
  alt: string
  title: string
  quotes: ReactNode[]
  slug?: string
}> = [
  {
    title: 'donald trump nft (real)',
    src: artImages.DonaldTrumpNft,
    alt: 'satirical portrayal of a Donald Trump NFT involving a stick figure shooting laser beams out of their eyes and wearing a cape',
    quotes: [
      "Wow it's so epic thanks [...] best present ever",
      'You had a stroke [of genius] on a page??',
    ],
  },
  {
    title: 'unnamed waifu',
    src: artImages.UnnamedWaifu,
    alt: 'a drawing of a waifu with a speech bubble saying "I love you"',
    quotes: [
      // omg i love that anime too
      'omg i love that [...] too',
    ],
  },
]

const ArtPage = () => {
  return (
    <PostLayout
      title="Art"
      description='...or more accurately "art". Welcome to the world of the authentic artistique endevours of Soorria Saruva.'
      patterns={['doodle-pattern-2']}
    >
      <ProseWrapper>
        {art.map(item => {
          const slug = item.slug || paramCase(item.title)
          return (
            <Fragment key={slug}>
              <h2 id={slug}>
                {item.title}
                <CustomLink
                  href={`#${slug}`}
                  className="heading-anchor"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </h2>

              <MDXImage src={item.src} alt={item.alt} placeholder="blur" />

              {item.quotes.length ? (
                <>
                  <h3>What people are saying</h3>
                  {item.quotes.map((quote, i) => (
                    <blockquote key={i}>{quote}</blockquote>
                  ))}
                </>
              ) : null}
            </Fragment>
          )
        })}
      </ProseWrapper>
    </PostLayout>
  )
}

export default ArtPage
