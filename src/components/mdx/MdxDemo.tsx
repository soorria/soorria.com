'use client'

import type { ComponentType } from 'react'
import { BubblingDemo } from '~data/blog/event-delegation/components'
import ReactDemo from './ReactDemo.client'

const demos = {
  'event-delegation': BubblingDemo,
} satisfies Record<string, ComponentType>

export type MdxDemoId = keyof typeof demos

const MdxDemo = ({ id, init = 'mount' }: { id: MdxDemoId; init?: 'lazy' | 'mount' | 'always' }) => {
  const Component = demos[id]
  return <ReactDemo content={<Component />} init={init} />
}

export default MdxDemo
