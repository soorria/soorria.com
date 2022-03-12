export const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

export const randomArray = (min: number, max: number, length: number): number[] => {
  return Array.from({ length }, () => random(min, max))
}

export const randomIndex = (arr: unknown[]): number => random(0, arr.length - 1)

export const randomItem = <T>(arr: T[]): T => arr[randomIndex(arr)]
