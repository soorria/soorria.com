'use client'

import type { MagicSprinklesProps } from './magic-sprinkles.component'
import { LazyMagicSprinkles } from './magic-sprinkles.lazy'

export function LazyClientMagicSprinkles(props: MagicSprinklesProps) {
  return <LazyMagicSprinkles {...props} />
}
