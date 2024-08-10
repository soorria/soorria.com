type Singleton = {
  id: number
  slug: string
  content: string
  is_multiline: boolean
}

const API_KEY = process.env.SUPABASE_ANON_KEY
const BASE_URL = process.env.SUPABASE_URL

async function fetchSingleton(slug: string): Promise<Singleton | null> {
  const url = new URL(`/rest/v1/singletons`, BASE_URL)
  url.searchParams.set('select', '*')
  url.searchParams.set('slug', `eq.${slug}`)
  const response = await fetch(url.toString(), {
    headers: {
      apiKey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as Singleton[]

  return data[0] ?? null
}

const getSingleton = async (slug: string): Promise<Singleton> => {
  const data = await fetchSingleton(slug)

  if (!data) {
    throw new Error(`Singleton not found: ${slug}`)
  }

  return data
}

export const getSingletonTextSafe = async (slug: string): Promise<string | null> => {
  try {
    const singleton = await getSingleton(slug)
    return singleton.content
  } catch (err) {
    return null
  }
}

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
