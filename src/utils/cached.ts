const cache = new Map<string, { timeout: NodeJS.Timeout; value: unknown }>()

export const cached = <T>(key: string, revalidate: number, getter: () => T): T => {
  console.log(`called for ${JSON.stringify(key)}`)
  if (!cache.has(key)) {
    console.log(`running getter for ${JSON.stringify(key)}`)
    cache.set(key, {
      value: getter(),
      timeout: setTimeout(() => {
        console.log(`deleting ${JSON.stringify(key)}`)
        cache.delete(key)
      }, revalidate * 1000),
    })
  }
  return cache.get(key) as T
}
