const cache = new Map<string, unknown>()

export const cached = <T>(key: string, getter: () => T): T => {
  if (!cache.has(key)) {
    cache.set(key, getter())
  }
  return cache.get(key) as T
}
