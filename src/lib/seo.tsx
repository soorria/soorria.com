import { For, VoidComponent } from 'solid-js'
import { Link, Meta, Title } from 'solid-start'

export type OpenGraph = {
  url?: string
  type?: string
  title?: string
  description?: string
  images?: {
    url: string
    width: number
    height: number
    alt?: string
    type?: string
    secureUrl?: string
  }[]
  article?: {
    tags?: string[]
    publishedTime?: string
    authors?: string[]
    section?: string
    modifiedTime?: string
    expirationTime?: string
  }
}

export type TwitterSeo = {
  handle?: string
  site?: string
  cardType?: 'summary_large_image'
}

const title = 'Soorria Saruva - Full Stack Software Engineer'
const description = 'Full Stack Software Engineer'

const defaultSeo = {
  titleTemplate: '%s • Soorria Saruva',
  // titleTemplate: '%s | Soorria Saruva',
  // titleTemplate: '%s - Soorria Saruva',
  // titleTemplate: '%s / Soorria Saruva',
  defaultTitle: title,
  canonical: 'https://soorria.com',
  description,
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://soorria.com',
    title,
    description,
    images: [
      {
        url: 'https://soorria.com/api/og?title=Soorria%20Saruva&subtitle=soorria.com',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    handle: '@soorriously',
    site: '@soorriously',
    cardType: 'summary_large_image',
  },
}

export const DefaultSeo: VoidComponent = () => {
  return (
    <>
      <Meta name="robots" content="index,follow" />
      <Meta name="googlebot" content="index,follow" />
      <Title>{defaultSeo.defaultTitle}</Title>
      <Link rel="canonical" href={defaultSeo.canonical} />
      <Meta name="twitter:card" content={defaultSeo.twitter.cardType} />
      <Meta name="twitter:site" content={defaultSeo.twitter.site} />
      <Meta name="twitter:creator" content={defaultSeo.twitter.handle} />
      <Meta name="description" content={description} />

      <Meta property="og:url" content={defaultSeo.openGraph.url} />
      <Meta property="og:title" content={defaultSeo.openGraph.title} />
      <Meta property="og:description" content={defaultSeo.openGraph.description} />

      <For each={defaultSeo.openGraph.images}>
        {image => (
          <>
            <Meta property="og:image:width" content={image.width.toString()} />
            <Meta property="og:image:height" content={image.height.toString()} />
            <Meta property="og:image:url" content={image.url} />
          </>
        )}
      </For>
    </>
  )
}

export const Seo: VoidComponent<{
  title: string
  description: string
  canonical: string
  openGraph: OpenGraph
}> = props => {
  return (
    <>
      <Title>{defaultSeo.titleTemplate.replace('%s', props.title)}</Title>
      <Link rel="canonical" href={props.canonical} />
      <Meta name="description" content={props.description} />

      <Meta property="og:url" content={props.openGraph.url} />
      <Meta property="og:title" content={props.openGraph.title} />
      <Meta property="og:description" content={props.openGraph.description} />

      <For each={props.openGraph.images}>
        {image => (
          <>
            <Meta property="og:image:width" content={image.width.toString()} />
            <Meta property="og:image:height" content={image.height.toString()} />
            <Meta property="og:image:url" content={image.url} />
          </>
        )}
      </For>
    </>
  )
}
