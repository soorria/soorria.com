import { lazy } from 'solid-js'

import CustomLink from '../CustomLink'

export const minimalComponents = {
  Sparkles: lazy(() => import('./Sparkles')),
  a: CustomLink,
}
