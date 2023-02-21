import fs from 'fs'
import path from 'path'

type Route = Source | Handler
type Source = {
  src: string
  dest?: string
  headers?: Record<string, string>
  methods?: string[]
  continue?: boolean
  caseSensitive?: boolean
  check?: boolean
  status?: number
  has?: Array<HostHasField | HeaderHasField | CookieHasField | QueryHasField>
  missing?: Array<HostHasField | HeaderHasField | CookieHasField | QueryHasField>
  locale?: Locale
  middlewarePath?: string
}
type Locale = {
  redirect?: Record<string, string>
  cookie?: string
}
type HostHasField = {
  type: 'host'
  value: string
}
type HeaderHasField = {
  type: 'header'
  key: string
  value?: string
}
type CookieHasField = {
  type: 'cookie'
  key: string
  value?: string
}
type QueryHasField = {
  type: 'query'
  key: string
  value?: string
}
type HandleValue =
  | 'rewrite'
  | 'filesystem' // check matches after the filesystem misses
  | 'resource'
  | 'miss' // check matches after every filesystem miss
  | 'hit'
  | 'error' //  check matches after error (500, 404, etc.)

type Handler = {
  handle: HandleValue
  src?: string
  dest?: string
  status?: number
}
type ImageFormat = 'image/avif' | 'image/webp'

type RemotePattern = {
  protocol?: 'http' | 'https'
  hostname: string
  port?: string
  pathname?: string
}

type ImagesConfig = {
  sizes: number[]
  domains: string[]
  remotePatterns?: RemotePattern[]
  minimumCacheTTL?: number // seconds
  formats?: ImageFormat[]
  dangerouslyAllowSVG?: boolean
  contentSecurityPolicy?: string
}
type WildCard = {
  domain: string
  value: string
}

type WildcardConfig = Array<WildCard>

type Override = {
  path?: string
  contentType?: string
}

type OverrideConfig = Record<string, Override>

type Config = {
  version: 3
  routes?: Route[]
  images?: ImagesConfig
  wildcard?: WildcardConfig
  overrides?: OverrideConfig
  cache?: string[]
}

const run = async () => {
  const configPath = path.resolve('.', '.vercel', 'output', 'config.json')
  const json = fs.readFileSync(configPath)
  const config: Config = JSON.parse(json.toString())

  const setupImages = () => {
    config.images = {
      domains: [],
      sizes: [640, 750, 828, 1080, 1200 /* 1920, 2048, 3840 */],
      formats: ['image/avif', 'image/webp'],
    }
  }

  const setupMiddleware = () => {
    try {
      fs.mkdirSync('./.vercel/output/functions/middleware.func')
    } catch {
      //
    }
    fs.copyFileSync('./src/middleware.js', './.vercel/output/functions/middleware.func/index.js')
    fs.writeFileSync(
      './.vercel/output/functions/middleware.func/.vc-config.json',
      JSON.stringify(
        {
          runtime: 'edge',
          entrypoint: 'index.js',
        },
        null,
        2
      )
    )
    if (!config.routes) return
    const renderFuncIndex = config.routes.findIndex(r => r.dest?.includes('render'))
    if (renderFuncIndex === -1) return
    config.routes.splice(renderFuncIndex, 0, {
      src: '/(.*)',
      middlewarePath: 'middleware',
      continue: true,
    })
  }

  const setupBuildCache = () => {
    config.cache = ['.cache/**', 'node_modules/**']
  }

  setupImages()
  setupMiddleware()
  setupBuildCache()

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

run()
