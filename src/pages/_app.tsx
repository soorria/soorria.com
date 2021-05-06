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
  if (pageProps.noBoilerPlate) return <Component {...pageProps} />
  return (
    <PlausibleProvider domain="mooth.tech" customDomain="https://plausible.mooth.tech" selfHosted>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo {...SEO} />
      <Header />
      <main role="main" id="main-content" className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </PlausibleProvider>
  )
}

export default MyApp
