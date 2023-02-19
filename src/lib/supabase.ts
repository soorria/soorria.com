const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

type Singleton = {
  id: number
  slug: string
  content: string
  is_multiline: boolean
}

export const getSingleton = async (slug: string): Promise<Singleton> => {
  const res = await fetch(
    `${url}/rest/v1/singletons?${new URLSearchParams({
      slug: `eq.${encodeURIComponent(slug)}`,
      select: '*',
    })}`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    }
  )

  const json = await res.json()

  console.log(res.ok, { json })
  if (!res.ok) {
    throw new Error('Could not fetch singleton')
  }

  const data = (json as Singleton[])?.[0]
  console.log(data)

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
