'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const SolidDemo = dynamic(() => import('./SolidDemo'), { ssr: false })
export function SolidClientDemo(props: ComponentProps<typeof SolidDemo>) {
  return <SolidDemo {...props} />
}
