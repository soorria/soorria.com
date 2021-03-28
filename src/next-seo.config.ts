import { DefaultSeoProps } from 'next-seo'

const title = 'Soorria Saruva - Full Stack Web Developer'
const description = 'Full Stack Web Developer'

export const SEO: DefaultSeoProps = {
  // titleTemplate: '%s • Soorria Saruva',
  titleTemplate: '%s | Soorria Saruva',
  // titleTemplate: '%s - Soorria Saruva',
  // titleTemplate: '%s / Soorria Saruva',
  defaultTitle: title,
  canonical: 'https://mooth.tech',
  description,
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://mooth.tech',
    title,
    description,
    images: [
      {
        url: 'https://mooth.tech/og.png',
        height: 900,
        width: 1600,
      },
    ],
  },
  twitter: {
    handle: '@soorriously',
    site: '@soorriously',
    cardType: 'summary_large_image',
  },
}
