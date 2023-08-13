import CustomLink from '~/components/CustomLink'
import MDXImage from '~/components/mdx/MDXImage'
import PostLayout from '~/components/posts/PostLayout'
import ProseWrapper from '~/components/posts/ProseWrapper'
import { artImages } from './images'
import { Fragment, type ReactNode } from 'react'
import { paramCase } from 'change-case'
import { getOgImage } from '~/utils/og'
import { PUBLIC_URL } from '~/constants'
import { randomItem } from '~/utils/random'
import { PageRenderedAt } from '~/components/PageRenderedAt'
import { SlightBleedContentWrapper } from '~/components/mdx/SlightBleedContentWrapper'
import { LazyMagicSprinkles } from '~/app/(no-layout)/installations/magic-sprinkles/magic-sprinkles.lazy'
import Link from 'next/link'
import { CODE_BLOCK_CLASSNAMES } from '~/components/mdx/utils'
import cx from '~/utils/cx'
import ShowWhenVisible from '~/components/ShowWhenVisible'

export const revalidate = 10

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
    images: [getOgImage({ title: 'Authentic Artistique Endevours', subtitle: 'soorria.com/art' })],
  },
}

const realNftMeanings: string[] = [
  'Not For Thinking',
  'Nebulous Frivolous Token',
  'Nonexistent Fantasy Treasure',
  'Notoriously Fickle Trinket',
  'Nonsensical Fad Trend',
  'Nifty Fictitious Token',
  'Never-ending Foolish Transmission',
  'Noisy Futile Tchotchke',
  'Novelty Fabricated Trophy',
  'Notoriously Flawed Triviality',
  'Nonfunctional Farce Transaction',
]

const Abbr = ({ title, children, ...rest }: { title: string; children: ReactNode }) => {
  return (
    <>
      <abbr
        className="tooltip cursor-help before:text-sm before:font-normal"
        {...rest}
        aria-label={title}
      >
        {children}
        <sup aria-hidden className="text-sm font-bold text-drac-pink">
          ?
        </sup>
      </abbr>
      <span className="sr-only">{title}</span>
    </>
  )
}

const getArt = (): Array<
  {
    content: ReactNode
    quotes?: ReactNode[]
    fullInstallationPath?: string
  } & ({ title: string; slug?: string } | { title: Exclude<ReactNode, string>; slug: string })
> => [
  {
    title: (
      <>
        donald trump <Abbr title={randomItem(realNftMeanings)}>nft</Abbr> (real)
      </>
    ),
    slug: 'donald-trump-nft-real',
    content: (
      <MDXImage
        src={artImages.DonaldTrumpNft}
        alt="satirical portrayal of a Donald Trump NFT involving a stick figure shooting laser beams out of their eyes and wearing a cape"
        placeholder="blur"
      />
    ),
    quotes: [
      "Wow it's so epic thanks [...] best present ever",
      'You had a stroke [of genius] on a page??',
    ],
  },
  {
    title: 'unnamed waifu',
    content: (
      <MDXImage
        src={artImages.UnnamedWaifu}
        alt='a drawing of a waifu with a speech bubble saying "I love you"'
        placeholder="blur"
      />
    ),
    quotes: [
      // omg i love that anime too
      'omg i love that [...] too',
    ],
  },
  {
    title: 'magic sprinkles',
    content: (
      <SlightBleedContentWrapper>
        <ShowWhenVisible className="relative aspect-video overflow-hidden rounded-lg">
          <LazyMagicSprinkles />
        </ShowWhenVisible>
      </SlightBleedContentWrapper>
    ),
    fullInstallationPath: '/installations/magic-sprinkles',
  },
]

const ArtPage = () => {
  const art = getArt()
  return (
    <>
      <PostLayout
        title="Art"
        description='...or more accurately "art". Welcome to the world of the authentic artistique endevours of Soorria Saruva.'
        patterns={['doodle-pattern-2']}
        backdrop={<LazyMagicSprinkles fade isInHero />}
        hidePatternsWhenJs
      >
        <ProseWrapper>
          {art.map(item => {
            const slug =
              typeof item.title === 'string' ? item.slug || paramCase(item.title) : item.slug
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

                <div className="relative">
                  {item.content}
                  {item.fullInstallationPath && (
                    <div className="not-prose pointer-events-none absolute inset-x-0 bottom-4 text-center">
                      <Link
                        href={item.fullInstallationPath}
                        className={cx(CODE_BLOCK_CLASSNAMES.button, 'pointer-events-auto')}
                      >
                        see full installation
                      </Link>
                    </div>
                  )}
                </div>

                {item.quotes?.length ? (
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
      <PageRenderedAt />
    </>
  )
}

export default ArtPage
