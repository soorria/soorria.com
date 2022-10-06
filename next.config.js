/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// const withTM = require('next-transpile-modules')(['rehype-raw'])

const { withPlausibleProxy } = require('next-plausible')

const withPlausibleConfig = withPlausibleProxy({
  scriptName: 'potato',
  customDomain: 'https://plausible.mooth.tech',
})

/** @type {import('next').NextConfig} */
const config = {
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/stats',
        destination: 'https://plausible.mooth.tech/mooth.tech',
        permanent: false,
      },
      {
        source: '/src',
        destination: 'https://github.com/soorria/soorria.com',
        permanent: false,
      },
      {
        source: '/contact',
        destination: 'https://soorria.com/?ref=%2Fcontact#contact',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/posts/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/post/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/p/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/s/:path*',
        destination: '/snippets/:path*',
        permanent: true,
      },
      {
        source: '/snippet/:path*',
        destination: '/snippets/:path*',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/og',
        destination: 'https://og-gen-mooth.vercel.app/api/og',
      },
      {
        source: '/og.png',
        destination:
          'https://og-gen-mooth.vercel.app/api/og?title=Soorria%20Saruva&subtitle=soorria.com',
      },
    ]
  },
  reactStrictMode: true,
  // swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
}

module.exports = withPlausibleConfig(withBundleAnalyzer(config))
