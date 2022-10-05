export const inspect = <T extends unknown>(obj: T, ...args: unknown[]): T => (
  console.log(...args, obj), obj
)
