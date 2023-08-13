import dynamic from 'next/dynamic'

export const LazyMagicSprinkles = dynamic(() => import('./magic-sprinkles.component'), {
  ssr: false,
})
