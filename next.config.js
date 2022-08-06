/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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
    images: {
      allowFutureImage: true,
    },
  },
}

module.exports = withPlausibleConfig(withBundleAnalyzer(config))
