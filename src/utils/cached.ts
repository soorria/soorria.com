const cache = new Map<string, unknown>()

export const cached = <T>(key: string, getter: () => T): T => {
  console.log(`called for ${JSON.stringify(key)}`)
  if (!cache.has(key)) {
    console.log(`running getter for ${JSON.stringify(key)}`)
    cache.set(key, getter())
  }
  return cache.get(key) as T
}
