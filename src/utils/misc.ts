export const inspect = <T extends unknown>(obj: T, ...args: unknown[]): T => (
  console.log(...args, obj), obj
)

export const arrayUnique = <T>(array: T[]): T[] => Array.from(new Set(array))
