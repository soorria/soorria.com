declare module '*.png' {
  import type { StaticImageData } from 'next/image'
  const value: StaticImageData
  export default value
}
