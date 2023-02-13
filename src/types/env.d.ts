interface ImportMetaEnv {
  SUPABASE_ANON_KEY: string
  SUPABASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
