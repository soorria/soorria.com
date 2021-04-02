/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'mdx-prism' {
  export default any
}

declare namespace NodeJS {
  interface ProcessEnv {
    DETA_PROJECT_KEY: string
    PREVIEW_PW: string
  }
}
