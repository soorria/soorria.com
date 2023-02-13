// @refresh reload
import { Suspense } from 'solid-js'
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
  Title,
} from 'solid-start'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import NoJsStyles from './styles/NoJsStyles'
import './styles/root.css'

export default function Root() {
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
      </Head>
      <Body class="h-full min-h-screen bg-drac-base text-drac-content">
        <Suspense>
          <ErrorBoundary>
            <div class="flex h-full min-h-screen flex-col">
              <Header />

              <main role="main" id="main-content" class="grow">
                <Routes>
                  <FileRoutes />
                </Routes>
              </main>

              <Footer />
            </div>

            <NoJsStyles />
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
