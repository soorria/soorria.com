import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import PlausibleProvider from 'next-plausible'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SEO } from '@/next-seo.config'

import '../styles/globals.css'
import '../styles/code-block.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const renderedAt = pageProps.renderedAt ? new Date(pageProps.renderedAt) : null

  return (
    <PlausibleProvider domain="mooth.tech" customDomain="https://mooth.tech" selfHosted>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo {...SEO} />
      <Header />
      <main role="main" id="main-content" className="grow">
        <Component {...pageProps} />
      </main>
      <Footer />
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
