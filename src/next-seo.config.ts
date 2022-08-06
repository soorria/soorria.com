import type { DefaultSeoProps } from 'next-seo'

const title = 'Soorria Saruva - Full Stack Software Engineer'
const description = 'Full Stack Software Engineer'

export const SEO: DefaultSeoProps = {
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
