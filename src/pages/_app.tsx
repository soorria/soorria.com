import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import PlausibleProvider from 'next-plausible'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SEO } from '@/next-seo.config'

import '../styles/globals.css'
import '../styles/prose.css'
import { ReactNode } from 'react'

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
  const renderedAt = pageProps.renderedAt ? new Date(pageProps.renderedAt) : null
  const wrapper = pageProps.layout === 'nah' ? noopWrapper : defaultWrapper

  return (
    <PlausibleProvider domain="mooth.tech" customDomain="https://mooth.tech" selfHosted>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo {...SEO} />
      {wrapper(<Component {...pageProps} />)}
      {renderedAt ? (
        <div
          className="relative bottom-2 w-full select-none text-center text-[.5rem] text-drac-purple"
          aria-hidden
        >
          Rendered at {renderedAt.toLocaleTimeString()}, {renderedAt.toLocaleDateString()}
        </div>
      ) : null}
    </PlausibleProvider>
  )
}

export default MyApp
