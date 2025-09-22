'use client'

import dynamic from 'next/dynamic'

export const LazyGiscus = dynamic(() => import('./Giscus.client'), {
  ssr: false,
})
