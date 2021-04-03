import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/code-block.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DefaultSeo } from 'next-seo'
import { SEO } from '@/next-seo.config'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  if (pageProps.noBoilerPlate) return <Component {...pageProps} />
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo {...SEO} />
      <Header />
      <main role="main" id="main-content" className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

export default MyApp
