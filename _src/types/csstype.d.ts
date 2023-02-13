import type * as _CSS from 'csstype'

declare module 'csstype' {
  interface Properties {
    [customPropery: `--${string}`]: string
  }
}
