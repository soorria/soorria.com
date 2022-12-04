import Head from 'next/head'
import type { ReactNode } from 'react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import PlausibleProvider from 'next-plausible'

import Header from '~/components/Header'
import Footer from '~/components/Footer'
import { SEO } from '~/next-seo.config'

import '../styles/globals.css'
import '../styles/prose.css'
import NoJsStyles from '~/styles/NoJsStyles'

const defaultWrapper = (node: ReactNode) => (
  <>
    <Header />
    <main role="main" id="main-content" className="grow">
      {node}
    </main>
    <Footer />
  </>
)

const noopWrapper = (node: ReactNode) => node

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { renderedAt, layout } = pageProps as { renderedAt?: string; layout?: string }
  const renderedAtDate = renderedAt ? new Date(renderedAt) : null
  const wrapper = layout === 'nah' ? noopWrapper : defaultWrapper

  return (
    <PlausibleProvider domain="mooth.tech" customDomain="https://soorria.com" selfHosted>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo {...SEO} />
      {wrapper(<Component {...pageProps} />)}
      {renderedAtDate ? (
        <div
          className="relative bottom-2 w-full select-none text-center text-[.5rem] text-drac-pink"
          suppressHydrationWarning
          aria-hidden
        >
          Rendered at {renderedAtDate.toLocaleTimeString()}, {renderedAtDate.toLocaleDateString()}
        </div>
      ) : null}
      <NoJsStyles />
    </PlausibleProvider>
  )
}

export default MyApp
