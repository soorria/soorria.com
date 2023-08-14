import '@total-typescript/ts-reset'
import type { ReactNode } from 'react'
import PlausibleProvider from 'next-plausible'

import '~/styles/globals.css'
import NoJsStyles from '~/styles/NoJsStyles'
import '~/styles/prose.css'
import dynamic from 'next/dynamic'

const DevHelpers = dynamic(() => import('~/components/dev-helpers'), { ssr: false })

const title = 'Soorria Saruva - Full Stack Software Engineer'
const description = 'Full Stack Software Engineer'
export const metadata = {
  metadataBase: new URL('https://soorria.com'),
  title: {
    default: title,
    template: '%s • Soorria Saruva',
    // template: '%s | Soorria Saruva',
    // template: '%s - Soorria Saruva',
    // template: '%s / Soorria Saruva',
  },
  description,
  verification: {
    google: 'Cl0BjsWegjV0EoEmhPMVdyI9qWoAdOwh5S-h37tEaao',
  },
  icons: {
    icon: [
      { type: 'image/png', url: '/favicon-32x32.png', sizes: '32x32' },
      { type: 'image/png', url: '/favicon-16x16.png', sizes: '16x16' },
    ],
  },
  themeColor: '#282a36',
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#282a36',
  },
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
    creator: '@soorriously',
    site: '@soorriously',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://soorria.com',
  },
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="preload"
          href="/fonts/poppins-latin-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/poppins-latin-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-latin-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <PlausibleProvider domain="mooth.tech" customDomain="https://soorria.com" selfHosted />
      </head>
      <body className="relative h-full min-h-screen overflow-y-auto bg-drac-base text-drac-content">
        {children}
        <NoJsStyles />
        {process.env.NODE_ENV === 'development' && <DevHelpers />}
      </body>
    </html>
  )
}

export default RootLayout
