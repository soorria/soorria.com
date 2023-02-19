import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const client = createClient(url, anonKey)

type Singleton = {
  id: number
  slug: string
  content: string
  is_multiline: boolean
}

export const getSingleton = async (slug: string): Promise<Singleton> => {
  const { data, error } = await client.from('singletons').select('*').eq('slug', slug).maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error(`Singleton not found: ${slug}`)
  }

  return data as Singleton
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

export const getSingletonJsonSafe = async (slug: string): Promise<Record<string, unknown>> => {
  try {
    const singleton = await getSingleton(slug)
    const str = singleton.content
    const parsed = JSON.parse(str) as unknown
    return typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch (err) {
    return {}
  }
}
