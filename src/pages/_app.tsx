import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/code-block.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Soorria Saruva / mooth.tech</title>
      </Head>
      <Header />
      <main role="main" id="main-content" className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

export default MyApp
