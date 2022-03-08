export const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

export const randomArray = (min: number, max: number, length: number): number[] => {
  return Array.from({ length }, () => random(min, max))
}

export const randomItem = <T>(arr: T[]): T => {
  const idx = random(0, arr.length - 1)
  if (!arr[idx]) console.log({ arr, idx })
  return arr[idx]
}
