export const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

export const randomArray = (min: number, max: number, length: number): number[] => {
  return Array.from({ length }, () => random(min, max))
}
