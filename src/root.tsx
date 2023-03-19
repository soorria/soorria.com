// @refresh reload
import '@total-typescript/ts-reset'
import './styles/root.css'
import './styles/prose.css'

import { lazy, ParentComponent, Suspense } from 'solid-js'
import { NoHydration } from 'solid-js/web'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
} from 'solid-start'

import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { PlausibleScript } from './lib/potato'
import { DefaultSeo } from './lib/seo'
import NoJsStyles from './styles/NoJsStyles'

const ErrorPage = lazy(() => import('./routes/error'))

const Layout: ParentComponent = props => (
  <div class="flex h-full min-h-screen flex-col">
    <Header />

    <main role="main" id="main-content" class="grow">
      {props.children}
    </main>

    <NoHydration>
      <Footer />
    </NoHydration>
  </div>
)

export default function Root() {
  // const location = useLocation()

  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <Meta
          name="google-site-verification"
          content="Cl0BjsWegjV0EoEmhPMVdyI9qWoAdOwh5S-h37tEaao"
        />
        <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <Link rel="manifest" href="/site.webmanifest" />
        <Meta name="msapplication-TileColor" content="#282a36" />
        <Meta name="theme-color" content="#282a36" />
        <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Link
          rel="preload"
          href="/fonts/poppins-latin-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Link
          rel="preload"
          href="/fonts/poppins-latin-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Link
          rel="preload"
          href="/fonts/jetbrains-mono-latin-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <DefaultSeo />
        <PlausibleScript />
      </Head>
      <Body class="h-full min-h-screen bg-drac-base text-drac-content">
        <Suspense>
          <ErrorBoundary
            fallback={(e, _reset) => {
              console.log(e)
              return (
                <Layout>
                  <ErrorPage statusCode={500} statusText="o no, an eror" tryAgain />
                </Layout>
              )
            }}
          >
            <Layout>
              <Routes>
                <FileRoutes />
              </Routes>
            </Layout>

            <NoHydration>
              <NoJsStyles />
            </NoHydration>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
