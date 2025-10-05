export const inspect = <T>(obj: T, ...args: unknown[]): T => (console.log(...args, obj), obj)

export const intersectionSet = <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
  const result = new Set<T>()
  set1.forEach(el => {
    if (set2.has(el)) result.add(el)
  })
  return result
}

export const ignoreError = <T>(promise: Promise<T>): Promise<T | undefined> =>
  promise.catch(() => undefined)
