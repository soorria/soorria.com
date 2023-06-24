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

export const getSingletonTextSafe = async (slug: string): Promise<string | null> => {
  try {
    const singleton = await getSingleton(slug)
    return singleton.content
  } catch (err) {
    return null
  }
}

export const getCachedSingletonTextSafe = getSingletonTextSafe

export const getSingletonJsonSafe = async <T extends Record<string, unknown>>(
  slug: string
): Promise<Partial<T>> => {
  try {
    const singleton = await getSingleton(slug)
    const str = singleton.content
    const parsed = JSON.parse(str) as unknown
    return (typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}) as Partial<T>
  } catch (err) {
    return {}
  }
}

export const getCachedSingletonJsonSafe = getSingletonJsonSafe
