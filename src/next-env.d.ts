/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'mdx-prism' {
  export default any
}

declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_ANON_KEY: string
    SUPABASE_URL: string
  }
}
