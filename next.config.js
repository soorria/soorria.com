/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const { FontaineTransform } = require('fontaine')

const options = {
  fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'],
  // You may need to resolve assets like `/fonts/Roboto.woff2` to a particular directory
  resolvePath: id => 'file://./public/fonts' + id,
}

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
      {
        source: '/cypress',
        destination: '/snippets/cypress',
        permanent: false,
      },
      {
        source: '/enzyme',
        destination: '/snippets/enzyme',
        permanent: false,
      },
      {
        source: '/diy-promise-all',
        destination: '/blog/promise-all',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/api/curl-card',
          has: [
            {
              type: 'header',
              key: 'user-agent',
              value: 'curl/(.*)',
            },
          ],
          missing: [
            {
              type: 'query',
              key: 'card',
              value: '(.*)',
            },
          ],
        },
      ],
      afterFiles: [],
      fallback: [
        // {
        //   source: '/api/og',
        //   destination: 'https://og-gen-mooth.vercel.app/api/og',
        // },
        {
          source: '/og.png',
          destination: 'https://soorria.com/api/og?title=Soorria%20Saruva&subtitle=soorria.com',
        },
      ],
    }
  },
  webpack(config, { isServer }) {
    config.plugins = config.plugins || []
    config.plugins.push(FontaineTransform.webpack(options))

    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          'builtin-modules': false,
          fs: false,
        },
      }
    }

    return config
  },
  images: {
    domains: process.env.NODE_ENV === 'development' ? ['localhost'] : undefined,
  },
  reactStrictMode: true,
  // swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    esmExternals: 'loose',
    serverComponentsExternalPackages: [
      'esbuild',
      '@mdx-js/esbuild',
      'shiki',
      'mdx-bundler',
      '@babel/core',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPlausibleConfig(withBundleAnalyzer(config))
