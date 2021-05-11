/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withPreact = require('next-plugin-preact')

module.exports = withPreact(
  withBundleAnalyzer({
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
  })
)
