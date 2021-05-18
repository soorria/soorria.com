/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next/dist/next-server/server/config-shared').NextConfig} */
const config = {
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/resume',
        destination: 'https://www.dropbox.com/s/77r0zful4vw2alk/resume.pdf',
        permanent: false,
      },
    ]
  },
  reactStrictMode: true,
}

module.exports = withBundleAnalyzer(config)
