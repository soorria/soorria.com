import { createClient } from '@supabase/supabase-js'

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

type Singleton = {
  id: number
  slug: string
  content: string
  is_multiline: boolean
}

export const getSingleton = async (slug: string): Promise<Singleton> => {
  const { data, error } = await client
    .from<Singleton>('singletons')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error(`Singleton not found: ${slug}`)
  }

  return data
}

export const getSingletonText = async (slug: string): Promise<string> => {
  const singleton = await getSingleton(slug)
  return singleton.content
}
